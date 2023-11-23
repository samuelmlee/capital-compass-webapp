import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, signal } from '@angular/core'
import { Observable, catchError, of, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import { TickersResponse } from '../model/tickers-response'
import { TickersSearchConfig } from '../model/tickers-search-config'

@Injectable({
  providedIn: 'root'
})
export class TickerService {
  public tickersResponseNewSignal = signal<TickersResponse>({ results: [], cursor: '' })
  public tickersResponseUpdateSignal = signal<TickersResponse>({ results: [], cursor: '' })

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

  public fetchDataWithConfig(config: TickersSearchConfig): void {
    this.getTickers({ searchTerm: config.searchTerm })
      .pipe(
        catchError((error) => {
          console.error('Error fetching tickers:', error)
          return of({ results: [], cursor: '' })
        })
      )
      .subscribe((response) => {
        this.tickersResponseNewSignal.set(response)
      })
      .unsubscribe()
  }

  public fetchDataWithCursor(cursor: string): void {
    this.getTickersByCursor(cursor)
      .pipe(
        catchError((error) => {
          console.error('Error fetching tickers:', error)
          return of({ results: [], cursor: '' })
        })
      )
      .subscribe((response) => {
        this.tickersResponseUpdateSignal.set(response)
      })
      .unsubscribe()
  }
}
