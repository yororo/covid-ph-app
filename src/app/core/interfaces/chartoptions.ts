export interface IChartOptions {
    legend: boolean;
    animations: boolean;
    xAxis: boolean;
    yAxis: boolean;
    showYAxisLabel: boolean;
    showXAxisLabel: boolean;
    xAxisLabel: string;
    yAxisLabel: string;
    xAxisTicks: any[];
    colorScheme: { domain: string[] };
}