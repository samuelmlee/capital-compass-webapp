import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, map, merge, switchMap } from 'rxjs'

import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { TickersTypesResponse as TickerTypesResponse } from '../model/ticker-types-response'
import { TickersResponse, TickersResponseSource } from '../model/tickers-response'
import { TickersSearchConfig } from '../model/tickers-search-config'

@Injectable({
  providedIn: 'root'
})
export class TickersService {
  public tickersSignal: Result<TickersResponse>
  public tickerTypesSignal: Result<TickerTypesResponse>

  private tickersCursorSubject = new Subject<string>()
  private tickersConfigSubject = new Subject<TickersSearchConfig>()
  private typesSubject = new Subject<void>()
  private apiUrl = environment.apiUrl

  public constructor(private _http: HttpClient) {
    this.tickersSignal = fromObsToSignal<TickersResponse>(
      merge(
        this.tickersConfigSubject.pipe(switchMap((config) => this.getTickersByConfig(config))),
        this.tickersCursorSubject.pipe(switchMap((cursor) => this.getTickersByCursor(cursor)))
      )
    )

    this.tickerTypesSignal = fromObsToSignal<TickerTypesResponse>(
      this.typesSubject.pipe(switchMap(() => this.getTickerTypes()))
    )
  }

  public fetchTickersByConfig(config: TickersSearchConfig): void {
    this.tickersConfigSubject.next(config)
  }

  public fetchTickersByCursor(cursor: string): void {
    this.tickersCursorSubject.next(cursor)
  }

  public fetchTickerTypes(): void {
    this.typesSubject.next()
  }

  private getTickersByConfig(searchConfig: TickersSearchConfig): Observable<TickersResponse> {
    const options = {
      params: new HttpParams()
        .set('type', searchConfig?.type ?? '')
        .set('search-term', searchConfig?.searchTerm ?? '')
        .set('ticker', searchConfig?.ticker ?? '')
    }
    return this._http
      .get<TickersResponse>(`${this.apiUrl}/stocks/tickers`, options)
      .pipe(map((response) => ({ ...response, source: TickersResponseSource.CONFIG })))
  }

  private getTickersByCursor(cursor: string): Observable<TickersResponse> {
    return this._http
      .get<TickersResponse>(`${this.apiUrl}/stocks/tickers/${cursor}`)
      .pipe(map((response) => ({ ...response, source: TickersResponseSource.CURSOR })))
  }

  private getTickerTypes(): Observable<TickerTypesResponse> {
    return this._http.get<TickerTypesResponse>(`${this.apiUrl}/stocks/tickers/types`)
  }
}
