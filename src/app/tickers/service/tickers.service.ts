import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, Signal, signal } from '@angular/core'
import { catchError, map, of } from 'rxjs'
import { environment } from 'src/environments/environment'
import { TickersResponse, TickersResponseResult } from '../model/tickers-response'
import { TickersSearchConfig } from '../model/tickers-search-config'

@Injectable({
  providedIn: 'root'
})
export class TickerService {
  private tickersResponseConfigSignal = signal<TickersResponseResult>({
    value: { results: [], cursor: '' },
    error: null
  })
  private tickersResponseCursorSignal = signal<TickersResponseResult>({
    value: { results: [], cursor: '' },
    error: null
  })

  private apiUrl = environment.apiUrl

  public constructor(private http: HttpClient) {}

  public get tickersResponseConfig(): Signal<TickersResponseResult> {
    return this.tickersResponseConfigSignal.asReadonly()
  }

  public get tickersResponseCursor(): Signal<TickersResponseResult> {
    return this.tickersResponseCursorSignal.asReadonly()
  }

  public getTickersByConfig(searchConfig: TickersSearchConfig): void {
    const options = {
      params: new HttpParams()
        .set('ticker', searchConfig?.ticker ?? '')
        .set('search-term', searchConfig?.searchTerm ?? '')
    }

    this.http
      .get<TickersResponse>(`${this.apiUrl}/stocks/tickers`, options)
      .pipe(
        map(
          (response) => ({ value: response, error: null }),
          catchError((err) => of({ value: null, error: err }))
        )
      )
      .subscribe((response) => this.tickersResponseConfigSignal.set(response))
  }

  public getTickersByCursor(cursor: string): void {
    this.http
      .get<TickersResponse>(`${this.apiUrl}/stocks/tickers/${cursor}`)
      .pipe(
        map(
          (response) => ({ value: response, error: null }),
          catchError((err) => of({ value: null, error: err }))
        )
      )
      .subscribe((response) => this.tickersResponseCursorSignal.set(response))
  }
}
