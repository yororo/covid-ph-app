import { Component, OnInit, HostListener } from '@angular/core';

import { ICasesToday } from './models/casestoday';
import { CasesService } from './services/cases.service';
import { ICasesHistorical } from './models/caseshistorical';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartData } from './models/chart/chartdata';
import { ChartDataPoint } from './models/chart/chartdatapoint';

@Component({
  selector: 'cp-covid-data',
  templateUrl: './covid-data.component.html',
  styleUrls: ['./covid-data.component.scss'],
})
export class CovidDataComponent implements OnInit {
  casesToday: ICasesToday;
  casesHistorical: ICasesHistorical;
  errorMessage: string;
  
  chartDataCases: ChartData;
  chartDataDeaths: ChartData;
  chartDataRecoveries: ChartData;

  totalCasesAsOf: string;
  casesProgressionAsOf: string;
  dailyCasesAsOf: string;

  // total cases chart options
  chartDataTotalCases: ChartData[];
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Cases';
  xAxisTicks: any[] = [];
  timeline: boolean = true;
  colorSchemeCasesProgressionChart = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  // new cases chart options (reuse other options from total cases chart)
  chartDataNewCases: any[];
  gradient = false;
  showLegend = false;
  xAxisLabelBar = 'Date';
  yAxisLabelBar = 'New Cases';
  colorSchemeDailyCasesChart = {
    domain: ['#5AA454']
  };

  // number chart
  chartDataNumbers: any[];
  cardColor: string = '#232837';
  numberChartHeightPx: number;
  colorSchemeNumberChart = {
    domain: ['#7aa3e5', '#5AA454', '#E44D25', '#CFC0BB']
  };

  constructor(private casesService: CasesService) {
    this.chartDataCases = new ChartData();
    this.chartDataCases.name = 'Confirmed';
    this.chartDataDeaths = new ChartData();
    this.chartDataDeaths.name = 'Deaths';
    this.chartDataRecoveries = new ChartData();
    this.chartDataRecoveries.name = 'Recoveries';
  }

  ngOnInit() {
    this.casesService.getCasesToday().subscribe({
        next: casesToday => {
            this.casesToday = casesToday;
            this.populateNumberChartData(this.casesToday);
            this.totalCasesAsOf = this.getAsOfDateString(new Date());
        },
        error: err => this.errorMessage
    });

    this.casesService.getCasesHistorical().subscribe({
        next: casesHistorical => {
            this.casesHistorical = casesHistorical;
            this.populateChartData(this.casesHistorical);
            this.chartDataTotalCases = [this.chartDataCases, this.chartDataDeaths, this.chartDataRecoveries];
        },
        error: err => this.errorMessage
    });
    
    this.adjustElementsOnResize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResizeEvent(event: any) {
    this.adjustElementsOnResize(event.target.innerWidth);
  }

  adjustElementsOnResize(windowWidth: number) {
    if(windowWidth < 600) {
      this.legend = false;
      this.numberChartHeightPx = 250;
      this.showXAxisLabel = false;
      this.showYAxisLabel = false;
    } else {
      this.legend = true;
      this.numberChartHeightPx = 150;
      this.showXAxisLabel = true;
      this.showYAxisLabel = true;
    }
  }

  private populateChartData(casesHistorical: ICasesHistorical): void {
    let cdpConfirmed: ChartDataPoint;
    let cdpDeaths: ChartDataPoint;
    let cdpRecovered: ChartDataPoint;
    const confirmedText: string = 'confirmed';
    const deathsText: string = 'deaths';
    const recoveredText: string = 'recovered';

    let previousKey: string;
    let previousValue: number;
    let keyFormatted: string;
    let lastDate: Date;
    this.chartDataNewCases = [];
    for (let [key, value] of Object.entries(this.casesHistorical.result)) {
      if (value[confirmedText] < 1 && value[deathsText] < 1 && value[recoveredText] < 1) {
        continue;
      }
      
      keyFormatted = this.getDateKeyString(new Date(key));

      cdpConfirmed = new ChartDataPoint();
      cdpConfirmed.name = keyFormatted;
      cdpConfirmed.value = value[confirmedText];
      this.chartDataCases.series.push(cdpConfirmed);

      cdpDeaths = new ChartDataPoint();
      cdpDeaths.name = keyFormatted;
      cdpDeaths.value = value[deathsText];
      this.chartDataDeaths.series.push(cdpDeaths);

      cdpRecovered = new ChartDataPoint();
      cdpRecovered.name = keyFormatted;
      cdpRecovered.value = value[recoveredText];
      this.chartDataRecoveries.series.push(cdpRecovered);

      // calculate for bar chart
      if (previousKey == null) {
        this.chartDataNewCases.push({ "name": keyFormatted, "value": value[confirmedText] });
      } else {
        this.chartDataNewCases.push({ "name": previousKey, "value": (value[confirmedText] - previousValue)});
      }

      previousKey = keyFormatted;
      previousValue = value[confirmedText];
      
      // TODO: refactor to assign only at last index
      lastDate = new Date(key);
    }

    // TODO: refactor 
    this.dailyCasesAsOf = this.getAsOfDateString(lastDate);
    this.casesProgressionAsOf = this.getAsOfDateString(lastDate);
    this.setAxisTicks(cdpConfirmed);
  }
  
  private setAxisTicks(cdpConfirmed: ChartDataPoint) {
    const firstDate: Date = new Date(this.chartDataCases.series[0].name);
    const lastDate: Date = new Date(cdpConfirmed.name);
    let dateTick: Date = new Date(firstDate);
    while (lastDate > dateTick) {
      this.xAxisTicks.push(this.getDateKeyString(dateTick));
      dateTick.setDate(dateTick.getDate() + 14);
    }
  }

  private getAsOfDateString(date: Date): string {
    const dateTimeFormatter = new Intl.DateTimeFormat(undefined, 
      { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    const [{ value: mo }, , { value: da }, , { value: ye }] = dateTimeFormatter.formatToParts(date);
    return `${mo} ${da}, ${ye}`;
  }

  private getDateKeyString(date: Date): string {
    const dateTimeFormatter = new Intl.DateTimeFormat(undefined, 
      { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    const [{ value: mo }, , { value: da }, , { value: ye }] = dateTimeFormatter.formatToParts(date);
    return `${mo}-${da}`;
  }

  private populateNumberChartData(casesToday: ICasesToday): void{
    this.chartDataNumbers = [
      { "name":"Total", "value":casesToday.cases },
      { "name":"Recovered", "value":casesToday.recovered },
      { "name":"Deaths", "value":casesToday.deaths },
      { "name":"Tests", "value":casesToday.totalTests }]
  }

}
