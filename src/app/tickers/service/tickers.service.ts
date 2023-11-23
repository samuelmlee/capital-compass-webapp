import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import { TickersResponse } from '../model/tickers-response'
import { TickersSearchConfig } from '../model/tickers-search-config'

@Injectable({
  providedIn: 'root'
})
export class TickerService {
  private apiUrl = environment.apiUrl

  public constructor(private http: HttpClient) {}

  public getTickers(searchConfig: TickersSearchConfig): Observable<TickersResponse> {
    const options = {
      params: new HttpParams()
        .set('ticker', searchConfig.ticker ?? '')
        .set('search-term', searchConfig.searchTerm ?? '')
        .set('results-count', searchConfig.resultsCount ?? '')
    }
    return this.http.get<TickersResponse>(`${this.apiUrl}/stocks/tickers`, options).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to fetch tickers by filter'))
      })
    )
  }

  public getTickersByCursor(cursor: string): Observable<TickersResponse> {
    return this.http.get<TickersResponse>(`${this.apiUrl}/stocks/tickers/${cursor}`).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to fetch tickers by cursor'))
      })
    )
  }
}