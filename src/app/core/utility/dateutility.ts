import { ICasesHistoricalRaw } from '../interfaces/caseshistoricalraw';

export abstract class DateUtility {
    static readonly FORMAT_NUMERIC = 'numeric';
    static readonly FORMAT_SHORT = 'short';
    static readonly FORMAT_LONG = 'long';

    static getDateStringForAsOf(date: Date): string {
        const [{ value: mo }, , { value: da }, , { value: ye }] = new Intl.DateTimeFormat(undefined, 
                {
                    year: this.FORMAT_NUMERIC, 
                    month: this.FORMAT_LONG, 
                    day: this.FORMAT_NUMERIC
                }).formatToParts(date);
        return `${mo} ${da}, ${ye}`;
    }

    static getDateStringForKey(date: Date): string {
        const [{ value: mo }, , { value: da }, , { value: ye }] = new Intl.DateTimeFormat(undefined, 
            {
                year: this.FORMAT_NUMERIC, 
                month: this.FORMAT_SHORT, 
                day: this.FORMAT_NUMERIC
            }).formatToParts(date);
        return `${mo}-${da}-${ye}`;
    }

    static getLastDateFromCasesHistoricalRaw(casesHistorical: ICasesHistoricalRaw): Date {
        return new Date(Object.keys(casesHistorical.result)[Object.keys(casesHistorical.result).length - 1]);
    }
}