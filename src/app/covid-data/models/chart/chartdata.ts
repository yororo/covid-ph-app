import { ChartDataPoint } from './chartdatapoint';

export class ChartData {
    name: string;
    series: ChartDataPoint[];

    constructor() {
        this.series = [];
    }
}