import { Injectable } from '@angular/core';
import { ICasesTodayRaw } from '../interfaces/casestodayraw';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ICasesHistoricalRaw } from '../interfaces/caseshistoricalraw';
import { ICasesHistoricalDetailedRaw } from '../interfaces/caseshistoricaldetailedraw';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly CASES_TODAY_URL = 'https://coronavirus-19-api.herokuapp.com/countries/philippines';
    private readonly CASES_HISTORICAL_URL = 'https://covidapi.info/api/v1/country/PHL';
    private readonly CASES_HISTORICAL_DETAILED_URL = 'https://coronavirus-ph-api.herokuapp.com/cases';

    constructor(private http: HttpClient) {}

    getCasesToday(): Observable<ICasesTodayRaw> {
        return this.http.get<ICasesTodayRaw>(this.CASES_TODAY_URL).pipe(
            catchError(this.handleError)
        );
    }
    
    getCasesHistorical(): Observable<ICasesHistoricalRaw> {
        return this.http.get<ICasesHistoricalRaw>(this.CASES_HISTORICAL_URL).pipe(
            catchError(this.handleError)
        );
    }

    getCasesHistoricalDetailed(): Observable<ICasesHistoricalDetailedRaw[]> {
        return this.http.get<ICasesHistoricalDetailedRaw[]>(this.CASES_HISTORICAL_DETAILED_URL).pipe(
            catchError(this.handleError)
        );
    }
    
    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }

        console.error(errorMessage);
        return throwError(errorMessage);
    }
}