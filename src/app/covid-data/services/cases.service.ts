import { Injectable } from '@angular/core';
import { ICasesToday } from '../models/casestoday';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ICasesHistorical } from '../models/caseshistorical';

@Injectable({
    providedIn: 'root'
})
export class CasesService {
    private casesTodayUrl = 'https://coronavirus-19-api.herokuapp.com/countries/philippines';
    private casesHistoricalUrl = 'https://covidapi.info/api/v1/country/PHL';

    constructor(private http: HttpClient) {}

    getCasesToday(): Observable<ICasesToday> {
        return this.http.get<ICasesToday>(this.casesTodayUrl).pipe(
            tap(data => console.log('getCasesToday: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }
    
    getCasesHistorical(): Observable<ICasesHistorical> {
        return this.http.get<ICasesHistorical>(this.casesHistoricalUrl).pipe(
            tap(data => console.log('getCasesHistorical: ' + JSON.stringify(data))),
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