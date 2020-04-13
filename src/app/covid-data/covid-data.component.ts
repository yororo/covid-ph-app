import { Component, OnInit } from '@angular/core';

import { ICasesToday } from './objects/casestoday';
import { CasesService } from './services/cases.service';
import { ICasesHistorical } from './objects/caseshistorical';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartData } from './objects/chart/chartdata';
import { ChartDataPoint } from './objects/chart/chartdatapoint';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'cp-covid-data',
  templateUrl: './covid-data.component.html',
  styleUrls: ['./covid-data.component.scss'],
})
export class CovidDataComponent implements OnInit {
  options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  casesToday: ICasesToday;
  casesHistorical: ICasesHistorical;
  errorMessage: string;
  
  chartDataCases: ChartData;
  chartDataDeaths: ChartData;
  chartDataRecoveries: ChartData;
  multi: ChartData[];
  view: any[] = [1300, 500];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Cases';
  xAxisTicks: any[] = [];
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private casesService: CasesService) {
    this.chartDataCases = new ChartData();
    this.chartDataCases.name = 'Confirmed';
    this.chartDataDeaths = new ChartData();
    this.chartDataDeaths.name = 'Deaths';
    this.chartDataRecoveries = new ChartData();
    this.chartDataRecoveries.name = 'Recoveries';
  }

  getDateToday(): string {
    return new Date().toLocaleString('en-PH', this.options);
  }

  ngOnInit() {
    this.casesService.getCasesToday().subscribe({
        next: casesToday => {
            this.casesToday = casesToday
        },
        error: err => this.errorMessage
    });

    this.casesService.getCasesHistorical().subscribe({
        next: casesHistorical => {
            this.casesHistorical = casesHistorical;
            this.populateChartData(this.casesHistorical);
            this.multi = [this.chartDataCases, this.chartDataDeaths, this.chartDataRecoveries];
        },
        error: err => this.errorMessage
    });
  }

  populateChartData(casesHistorical: ICasesHistorical): void {
    let cdpConfirmed: ChartDataPoint;
    let cdpDeaths: ChartDataPoint;
    let cdpRecovered: ChartDataPoint;

    for (let [key, value] of Object.entries(this.casesHistorical.result)){
      if (value["confirmed"] < 1 && value["deaths"] < 1 && value["recovered"] < 1) {
        continue;
      }

      cdpConfirmed = new ChartDataPoint();
      cdpConfirmed.name = key;
      cdpConfirmed.value = value["confirmed"];
      this.chartDataCases.series.push(cdpConfirmed);

      cdpDeaths = new ChartDataPoint();
      cdpDeaths.name = key;
      cdpDeaths.value = value["deaths"];
      this.chartDataDeaths.series.push(cdpDeaths);

      cdpRecovered = new ChartDataPoint();
      cdpRecovered.name = key;
      cdpRecovered.value = value["recovered"];
      this.chartDataRecoveries.series.push(cdpRecovered);
    }

    const firstDate: Date = new Date(this.chartDataCases.series[0].name);
    const lastDate: Date = new Date(cdpConfirmed.name);

    const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });

    let dateTick: Date = new Date(firstDate);
    while (lastDate > dateTick) {
      let [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(dateTick);
      this.xAxisTicks.push(ye + '-' + mo + '-' + da);

      dateTick.setDate(dateTick.getDate() + 7);
    }

    // let [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(lastDate);
    // this.xAxisTicks.push(ye + '-' + mo + '-' + da);
  }

}
