import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, map, switchMap } from 'rxjs'

import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { TickersResponse, TickersResponseSource } from '../model/tickers-response'
import { TickersSearchConfig } from '../model/tickers-search-config'

@Injectable({
  providedIn: 'root'
})
export class TickersService {
  public tickersConfigSignal: Result<TickersResponse>
  public tickersCursorSignal: Result<TickersResponse>

  private cursorSubject = new Subject<string>()
  private configSubject = new Subject<TickersSearchConfig>()
  private apiUrl = environment.apiUrl

  public constructor(private http: HttpClient) {
    this.tickersConfigSignal = fromObsToSignal<TickersResponse>(
      this.configSubject.pipe(switchMap((config) => this.getTickersByConfig(config)))
    )

    this.tickersCursorSignal = fromObsToSignal<TickersResponse>(
      this.cursorSubject.pipe(switchMap((cursor) => this.getTickersByCursor(cursor)))
    )
  }

  public fetchTickersByConfig(config: TickersSearchConfig): void {
    this.configSubject.next(config)
  }

  public fetchTickersByCursor(cursor: string): void {
    this.cursorSubject.next(cursor)
  }

  private getTickersByConfig(searchConfig: TickersSearchConfig): Observable<TickersResponse> {
    const options = {
      params: new HttpParams()
        .set('ticker', searchConfig?.ticker ?? '')
        .set('search-term', searchConfig?.searchTerm ?? '')
    }
    return this.http
      .get<TickersResponse>(`${this.apiUrl}/stocks/tickers`, options)
      .pipe(map((response) => ({ ...response, source: TickersResponseSource.CONFIG })))
  }

  private getTickersByCursor(cursor: string): Observable<TickersResponse> {
    return this.http
      .get<TickersResponse>(`${this.apiUrl}/stocks/tickers/${cursor}`)
      .pipe(map((response) => ({ ...response, source: TickersResponseSource.CURSOR })))
  }
}
