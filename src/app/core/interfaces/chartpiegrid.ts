import { IChartPieGridData } from './chartpiegriddata';
import { IChartPieGridOption } from './chartpiegridoptions';

export interface IChartPieGrid {
    data: IChartPieGridData[];
    totalCases: number;
    latestDate: Date;
    options: IChartPieGridOption;
}