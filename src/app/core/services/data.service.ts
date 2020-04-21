import { Injectable } from '@angular/core';
import { ICasesTodayRaw } from '../interfaces/casestodayraw';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ICasesHistoricalRaw } from '../interfaces/caseshistoricalraw';
import { ICasesHistoricalDetailedRaw } from '../interfaces/caseshistoricaldetailedraw';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private http: HttpClient) {}

    getCasesToday(): Observable<ICasesTodayRaw> {
        return this.http.get<ICasesTodayRaw>(environment.apiUrlCoronavirus19Api).pipe(
            catchError(this.handleError)
        );
    }
    
    getCasesHistorical(): Observable<ICasesHistoricalRaw> {
        return this.http.get<ICasesHistoricalRaw>(environment.apiUrlCovidApi).pipe(
            catchError(this.handleError)
        );
    }

    getCasesHistoricalDetailed(): Observable<ICasesHistoricalDetailedRaw> {
        return this.http.get<ICasesHistoricalDetailedRaw>(environment.apiUrlCoronavirusPhApi).pipe(
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