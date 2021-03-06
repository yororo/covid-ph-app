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
import { ICasesHistoricalDetailedRaw } from '../interfaces/caseshistoricaldetailedraw';
import { IChartPieGrid } from '../interfaces/chartpiegrid';
import { distinctUntilChanged } from 'rxjs/operators';
import { IChartPieGridData } from '../interfaces/chartpiegriddata';
import { IChartPieGridOption } from '../interfaces/chartpiegridoptions';

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

    getCaseByCity(casesHistoricalDetailed: ICasesHistoricalDetailedRaw): IChartPieGrid {
        return this.generateCasesByRegion(casesHistoricalDetailed);
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
            // dateKeyFormatted = new Intl.DateTimeFormat('en-GB').format(new Date(key));

            confirmedData.push({name: dateKeyFormatted, value: value[GlobalConstants.CASESHISTORICAL_CONFIRMED]});
            //console.log(dateKeyFormatted + "|" + value[GlobalConstants.CASESHISTORICAL_CONFIRMED]);
            // console.log(new Intl.DateTimeFormat('en-GB').format(new Date(key)));
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

    private generateCasesByRegion(casesHistoricalDetailed: ICasesHistoricalDetailedRaw): IChartPieGrid {
        let dataArr: IChartPieGridData[] = [];
        let dataName: string;
        let data: IChartPieGridData;
        let latestDate: Date;
        console.log(casesHistoricalDetailed.data.length);
        for(let casesHistoricalDetailedData of casesHistoricalDetailed.data) {
            dataName = (casesHistoricalDetailedData.location == 'For validation') ? 'N/A' : casesHistoricalDetailedData.location;
            data = dataArr.find(d => d.name == dataName);

            if (data == null) {
                dataArr.push({ name: dataName, value: 1 });
            } else {
                data.value += 1;
            }

            console.log('indexOf: ' + casesHistoricalDetailed.data.indexOf(casesHistoricalDetailedData));
            if (casesHistoricalDetailed.data.indexOf(casesHistoricalDetailedData) == (casesHistoricalDetailed.data.length - 1)) {
                latestDate = new Date(casesHistoricalDetailedData.date_of_announcement_to_public);
            }
        }

        return {
            totalCases: dataArr.length,
            latestDate: latestDate,
            data: dataArr.sort((x, y) => (x.value < y.value) ? 1 : -1).splice(0, 6),
            options: this.getCasesByRegionChartOptions()
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
                domain: ['#7aa3e5', '#E44D25', '#5AA454']
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

    private getCasesByRegionChartOptions(): IChartPieGridOption {
        let options: IChartPieGridOption = {
            legend: false,
            showLabels: true,
            colorScheme: {
                domain: ['#afafaf', '#ab000c', '#d50006', '#ff0000', '#ff5555', '#ffa2a2']
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