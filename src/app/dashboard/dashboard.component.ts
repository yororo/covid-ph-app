import { Component, OnInit, HostListener } from '@angular/core';
import { IChartLine } from '../core/interfaces/chartline';
import { IChartBar } from '../core/interfaces/chartbar';
import { IChartNumbers } from '../core/interfaces/chartnumbers';
import { DataService } from '../core/services/data.service';
import { ChartService } from '../core/services/chart.service';
import { DateUtility } from '../core/utility/dateutility';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  errorMessage: string;

  numberChartHeightPx: number;

  totalCasesAsOf: Date;
  casesProgressionAsOf: Date;
  dailyCasesAsOf: Date;

  casesProgressionChart: IChartLine;
  dailyCasesChart: IChartBar;
  todaysCasesChart: IChartNumbers;

  constructor(private dataService: DataService, private chartDataService: ChartService) { }

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

  @HostListener('window:resize', ['$event'])
  onResizeEvent(event: any) {
    this.adjustElementsOnResize(event.target.innerWidth);
  }

  adjustElementsOnResize(windowWidth: number) {
    if(windowWidth < 600) {
      this.numberChartHeightPx = 250;
      this.casesProgressionChart.options.legend = false;
      this.casesProgressionChart.options.showXAxisLabel = false;
      this.casesProgressionChart.options.showYAxisLabel = false;
      this.dailyCasesChart.options.legend = false;
      this.dailyCasesChart.options.showXAxisLabel = false;
      this.dailyCasesChart.options.showYAxisLabel = false;
    } else {
      this.numberChartHeightPx = 150;
      this.casesProgressionChart.options.legend = true;
      this.casesProgressionChart.options.showXAxisLabel = true;
      this.casesProgressionChart.options.showYAxisLabel = true;
      this.dailyCasesChart.options.legend = true;
      this.dailyCasesChart.options.showXAxisLabel = true;
      this.dailyCasesChart.options.showYAxisLabel = true;
    }
  }
}
