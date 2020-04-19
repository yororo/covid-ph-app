import { Injectable } from '@angular/core';
import { IChartLine } from '../interfaces/chartline';
import { ICasesHistoricalRaw } from '../interfaces/caseshistoricalraw';
import { IChartOptions } from '../interfaces/chartoptions';
import { IChartBar } from '../interfaces/chartbar';
import { IChartBarData } from '../interfaces/chartbardata';
import { ICasesTodayRaw } from '../interfaces/casestodayraw';
import { IChartNumbers } from '../interfaces/chartnumbers';
import { IChartNumbersData } from '../interfaces/chartnumbersdata';
import { IChartNumbersOption } from '../interfaces/chartnumbersoption';
import { GlobalConstants } from '../globalconstants';
import { DateUtility } from '../utility/dateutility';

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    
    //#region Public Methods
    getTotalCases(casesToday: ICasesTodayRaw): IChartNumbers {
        return this.generateCasesTodayData(casesToday);
    }

    getDailyCases(casesHistorical: ICasesHistoricalRaw): IChartBar {
        return this.generateDailyCasesData(casesHistorical);
    }

    getCaseProgression(casesHistorical: ICasesHistoricalRaw): IChartLine {
        return this.generateCasesProgressionData(casesHistorical);
    }
    //#endregion

    //#region Private Methods
    private generateCasesTodayData(casesToday: ICasesTodayRaw): IChartNumbers {
        let data: IChartNumbersData[] = [
            { name:GlobalConstants.CHART_TOTALCASES_LABEL_TOTAL, value:casesToday.cases },
            { name:GlobalConstants.CHART_TOTALCASES_LABEL_RECOVERED, value:casesToday.recovered },
            { name:GlobalConstants.CHART_TOTALCASES_LABEL_DEATHS, value:casesToday.deaths },
            { name:GlobalConstants.CHART_TOTALCASES_LABEL_TESTS, value:casesToday.totalTests }
        ]

        return {
            data: data,
            options: this.getTodaysCasesChartOptions()
        }
    }

    private generateCasesProgressionData(casesHistorical: ICasesHistoricalRaw): IChartLine {
        let confirmedData : {name: string, value: number}[] = [];
        let deathsData : {name: string, value: number}[] = [];
        let recoveredData : {name: string, value: number}[] = [];

        let dateKeyFormatted: string;
        for (let [key, value] of Object.entries(casesHistorical.result)) {
            if (value[GlobalConstants.CASESHISTORICAL_CONFIRMED] < 1 
                && value[GlobalConstants.CASESHISTORICAL_DEATHS] < 1 
                && value[GlobalConstants.CASESHISTORICAL_RECOVERED] < 1) {
              continue;
            }

            dateKeyFormatted = DateUtility.getDateStringForKey(new Date(key));

            confirmedData.push({name: dateKeyFormatted, value: value[GlobalConstants.CASESHISTORICAL_CONFIRMED]});
            deathsData.push({name: dateKeyFormatted, value: value[GlobalConstants.CASESHISTORICAL_DEATHS]});
            recoveredData.push({name: dateKeyFormatted, value: value[GlobalConstants.CASESHISTORICAL_RECOVERED]});
        }

        return {
            data: [ 
                {name: GlobalConstants.CHART_CASESPROG_LABEL_CONFIRMED, series: confirmedData}, 
                {name: GlobalConstants.CHART_CASESPROG_LABEL_DEATHS, series: deathsData}, 
                {name: GlobalConstants.CHART_CASESPROG_LABEL_RECOVERED, series: recoveredData}
            ],
            options: 
                this.getCasesProgressionChartOptions(new Date(confirmedData[0].name), new Date(confirmedData[confirmedData.length - 1].name), 14)
        };
    }

    private generateDailyCasesData(casesHistorical: ICasesHistoricalRaw): IChartBar {
        let data: IChartBarData[] = [];
        let previousKey: string;
        let previousValue: number;
        
        let dateKeyFormatted: string;

        for (let [key, value] of Object.entries(casesHistorical.result)) {
            if (value[GlobalConstants.CASESHISTORICAL_CONFIRMED] < 1 
                && value[GlobalConstants.CASESHISTORICAL_DEATHS] < 1 
                && value[GlobalConstants.CASESHISTORICAL_RECOVERED] < 1) {
              continue;
            }
            dateKeyFormatted = DateUtility.getDateStringForKey(new Date(key));
            
            if (previousKey == null) {
                data.push({ name: dateKeyFormatted, value: value[GlobalConstants.CASESHISTORICAL_CONFIRMED] });
            } else {
                data.push({ name: previousKey, value: (value[GlobalConstants.CASESHISTORICAL_CONFIRMED] - previousValue)});
            }

            previousKey = dateKeyFormatted;
            previousValue = value[GlobalConstants.CASESHISTORICAL_CONFIRMED];
        }

        return {
            data: data,
            options: this.getDailyCasesChartOptions(new Date(data[0].name), new Date(data[data.length - 1].name), 14)
        };
    }

    private getTodaysCasesChartOptions(): IChartNumbersOption {
        let options: IChartNumbersOption = {
            cardColor: '#232837',
            colorScheme: {
                domain: ['#7aa3e5', '#5AA454', '#E44D25', '#CFC0BB']
            }
        }
        return options;
    }

    private getCasesProgressionChartOptions(firstDate: Date, lastDate: Date, increments: number): IChartOptions {
        let options: IChartOptions = {
            legend: true,
            animations: true,
            xAxis: true,
            yAxis: true,
            showYAxisLabel: true,
            showXAxisLabel: true,
            xAxisLabel: GlobalConstants.CHART_CASESPROG_XAXIS_LABEL,
            yAxisLabel: GlobalConstants.CHART_CASESPROG_YAXIS_LABEL,
            xAxisTicks: this.getAxisTicks(firstDate, lastDate, increments),
            colorScheme: {
                domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
            }
        }
        return options;
    }
    
    private getDailyCasesChartOptions(firstDate: Date, lastDate: Date, increments: number): IChartOptions {
        let options: IChartOptions = {
            legend: false,
            animations: true,
            xAxis: true,
            yAxis: true,
            showYAxisLabel: true,
            showXAxisLabel: true,
            xAxisLabel: GlobalConstants.CHART_DAILYCASES_XAXIS_LABEL,
            yAxisLabel: GlobalConstants.CHART_DAILYCASES_YAXIS_LABEL,
            xAxisTicks: this.getAxisTicks(firstDate, lastDate, increments),
            colorScheme: {
                domain: ['#5AA454']
            }
        }
        return options;
    }

    private getAxisTicks(firstDate: Date, lastDate: Date, increments: number): string[] {
        let axisTicks: string[] = [];
        let dateTick: Date = new Date(firstDate);
        while (lastDate > dateTick) {
            axisTicks.push(DateUtility.getDateStringForKey(dateTick));
            dateTick.setDate(dateTick.getDate() + increments);
        }

        return axisTicks;
    }
    //#endregion
}