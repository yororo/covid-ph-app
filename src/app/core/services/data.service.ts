import { Injectable } from '@angular/core';
import { ICasesTodayRaw } from '../interfaces/casestodayraw';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ICasesHistoricalRaw } from '../interfaces/caseshistoricalraw';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly casesTodayUrl = 'https://coronavirus-19-api.herokuapp.com/countries/philippines';
    private readonly casesHistoricalUrl = 'https://covidapi.info/api/v1/country/PHL';

    constructor(private http: HttpClient) {}

    getCasesToday(): Observable<ICasesTodayRaw> {
        return this.http.get<ICasesTodayRaw>(this.casesTodayUrl).pipe(
            tap(data => console.log('[DATA SERVICE]: getCasesToday: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }
    
    getCasesHistorical(): Observable<ICasesHistoricalRaw> {
        return this.http.get<ICasesHistoricalRaw>(this.casesHistoricalUrl).pipe(
            tap(data => console.log('[DATA SERVICE]: getCasesHistorical: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }
    
    handleError(err: HttpErrorResponse) {
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