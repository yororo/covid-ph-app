import { Component, OnInit, HostListener } from '@angular/core';
import { IChartLine } from '../core/interfaces/chartline';
import { IChartBar } from '../core/interfaces/chartbar';
import { IChartNumbers } from '../core/interfaces/chartnumbers';
import { DataService } from '../core/services/data.service';
import { ChartService } from '../core/services/chart.service';
import { DateUtility } from '../core/utility/dateutility';
import { IChartOptions } from '../core/interfaces/chartoptions';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  //#region Public Fields
  errorMessage: string;

  numberChartHeightPx: number;

  totalCasesAsOf: Date;
  casesProgressionAsOf: Date;
  dailyCasesAsOf: Date;

  casesProgressionChart: IChartLine;
  dailyCasesChart: IChartBar;
  todaysCasesChart: IChartNumbers;
  //#endregion

  //#region Constructors
  constructor(private dataService: DataService, private chartDataService: ChartService) { }
  //#endregion

  //#region Implementations
  ngOnInit() {
    this.dataService.getCasesToday().subscribe({
        next: casesToday => {
            this.totalCasesAsOf = new Date();
            this.todaysCasesChart = this.chartDataService.getTotalCases(casesToday);
        },
        error: err => this.errorMessage
    });

    this.dataService.getCasesHistorical().subscribe({
      next: casesHistorical => {
        this.casesProgressionChart = this.chartDataService.getCaseProgression(casesHistorical);
        this.dailyCasesChart = this.chartDataService.getDailyCases(casesHistorical);

        this.dailyCasesAsOf = DateUtility.getLastDateFromCasesHistoricalRaw(casesHistorical);
        this.casesProgressionAsOf = this.dailyCasesAsOf;
      },
      error: err => this.errorMessage
  });
    
    this.adjustElementsOnResize(window.innerWidth);
  }
  //#endregion

  //#region Event listeners
  @HostListener('window:resize', ['$event'])
  onResizeEvent(event: any) {
    this.adjustElementsOnResize(event.target.innerWidth);
  }
  //#endregion

  //#region Private Methods
  private adjustElementsOnResize(windowWidth: number) {
    if(windowWidth < 600) {
      this.numberChartHeightPx = 250;
      this.switchChartOptionsOnResize(this.casesProgressionChart.options, false);
      this.switchChartOptionsOnResize(this.dailyCasesChart.options, false);
    } else {
      this.numberChartHeightPx = 150;
      this.switchChartOptionsOnResize(this.casesProgressionChart.options, true);
      this.switchChartOptionsOnResize(this.dailyCasesChart.options, true);
    }
  }

  private switchChartOptionsOnResize(chartOption: IChartOptions, value: boolean): void {
    chartOption.legend = value;
    chartOption.showXAxisLabel = value;
    chartOption.showYAxisLabel = value;
  }
  //#endregion
}
