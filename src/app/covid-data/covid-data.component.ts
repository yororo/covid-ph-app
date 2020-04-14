import { Component, OnInit } from '@angular/core';

import { ICasesToday } from './objects/casestoday';
import { CasesService } from './services/cases.service';
import { ICasesHistorical } from './objects/caseshistorical';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartData } from './objects/chart/chartdata';
import { ChartDataPoint } from './objects/chart/chartdatapoint';
import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';

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

  // total cases chart options
  multi: ChartData[];
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

  // new cases chart options (reuse other options from total cases chart)
  single: any[] = [];
  // single: any[] = [
  //   {
  //     "name": "2020-04-01",
  //     "value": 1
  //   },
  //   {
  //     "name": "2020-04-02",
  //     "value": 2
  //   },
  //   {
  //     "name": "2020-04-03",
  //     "value": 3
  //   }
  // ];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  xAxisLabelBar = 'Date';
  yAxisLabelBar = 'New Cases';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  colorSchemeBar = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private casesService: CasesService) {
    this.chartDataCases = new ChartData();
    this.chartDataCases.name = 'Confirmed';
    this.chartDataDeaths = new ChartData();
    this.chartDataDeaths.name = 'Deaths';
    this.chartDataRecoveries = new ChartData();
    this.chartDataRecoveries.name = 'Recoveries';
  }

  onResize(event) {
    if(event.target.innerWidth < 600) {
      this.legend = false;
    } else {
      this.legend = true;
    }
  }

  getDateToday(): string {
    return new Date().toLocaleString('en-PH', this.options);
  }

  ngOnInit() {
    console.log(window.innerWidth);
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
    
    if(window.innerWidth < 600) {
      this.legend = false;
    }
  }

  populateChartData(casesHistorical: ICasesHistorical): void {
    let cdpConfirmed: ChartDataPoint;
    let cdpDeaths: ChartDataPoint;
    let cdpRecovered: ChartDataPoint;
    const confirmedText: string = 'confirmed';
    const deathsText: string = 'deaths';
    const recoveredText: string = 'recovered';

    let previousKey: string;
    let previousValue: number;
    this.single = [];
    for (let [key, value] of Object.entries(this.casesHistorical.result)) {
      if (value[confirmedText] < 1 && value[deathsText] < 1 && value[recoveredText] < 1) {
        continue;
      }

      cdpConfirmed = new ChartDataPoint();
      cdpConfirmed.name = key;
      cdpConfirmed.value = value[confirmedText];
      this.chartDataCases.series.push(cdpConfirmed);

      cdpDeaths = new ChartDataPoint();
      cdpDeaths.name = key;
      cdpDeaths.value = value[deathsText];
      this.chartDataDeaths.series.push(cdpDeaths);

      cdpRecovered = new ChartDataPoint();
      cdpRecovered.name = key;
      cdpRecovered.value = value[recoveredText];
      this.chartDataRecoveries.series.push(cdpRecovered);

      // calculate for bar chart
      if (previousKey == null) {
        this.single.push({ "name": key, "value": value[confirmedText] });
      } else {
        this.single.push({ "name": previousKey, "value": (value[confirmedText] - previousValue)});
      }

      previousKey = key;
      previousValue = value[confirmedText];      
    }
    // this.single = [];
    // this.single.push({"name":"2020-04-01", "value":1});
    // this.single.push({"name":"2020-04-02", "value":2});
    // this.single.push({"name":"2020-04-03", "value":3});
  //     this.single = [
  //   {
  //     "name": "2020-04-01",
  //     "value": 1
  //   },
  //   {
  //     "name": "2020-04-02",
  //     "value": 2
  //   },
  //   {
  //     "name": "2020-04-03",
  //     "value": 3
  //   }
  // ];
    console.log(this.single);

    const firstDate: Date = new Date(this.chartDataCases.series[0].name);
    const lastDate: Date = new Date(cdpConfirmed.name);

    const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });

    let dateTick: Date = new Date(firstDate);
    while (lastDate > dateTick) {
      let [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(dateTick);
      this.xAxisTicks.push(ye + '-' + mo + '-' + da);

      dateTick.setDate(dateTick.getDate() + 7);
    }
  }

}
