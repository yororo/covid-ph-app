import { ICasesHistoricalDetailedDataRaw } from './caseshistoricaldetaileddataraw';

export interface ICasesHistoricalDetailedRaw {
    success: boolean,
    source: string;
    info: string;
    data: ICasesHistoricalDetailedDataRaw[]
}