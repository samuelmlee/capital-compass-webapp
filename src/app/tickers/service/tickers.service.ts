import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, map, merge, switchMap } from 'rxjs'
import { environment } from '../../../environments/environment'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { Result } from '../../shared/model/result'
import { fromObsToSignal } from '../../shared/utils/from-obs-to-signal'
import { TickerDetailsResponse } from '../model/ticker-details-response'
import { TickersTypesResponse as TickerTypesResponse } from '../model/ticker-types-response'
import { TickersResponse, TickersResponseSource } from '../model/tickers-response'
import { TickersSearchConfig } from '../model/tickers-search-config'

@Injectable({
  providedIn: 'root'
})
export class TickersService {
  public tickersResult: Result<TickersResponse>
  public tickerTypesResult: Result<TickerTypesResponse>
  public tickerDetailsResult: Result<TickerDetailsResponse>

  private _tickersCursorSubject = new Subject<string>()
  private _tickersConfigSubject = new Subject<TickersSearchConfig>()
  private _typesSubject = new Subject<void>()
  private _tickerDetailsSubject = new Subject<string>()
  private _apiUrl = environment.apiUrl

  constructor(
    private _http: HttpClient,
    private _errorHandlingService: ErrorHandlingService
  ) {
    this.tickersResult = fromObsToSignal<TickersResponse>(
      merge(
        this._tickersConfigSubject.pipe(switchMap((config) => this.getTickersByConfig(config))),
        this._tickersCursorSubject.pipe(switchMap((cursor) => this.getTickersByCursor(cursor)))
      ),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Tickers')
    )

    this.tickerTypesResult = fromObsToSignal<TickerTypesResponse>(
      this._typesSubject.pipe(switchMap(() => this.getTickerTypes())),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Tickers')
    )

    this.tickerDetailsResult = fromObsToSignal<TickerDetailsResponse>(
      this._tickerDetailsSubject.pipe(switchMap((symbol) => this.getTickerDetails(symbol))),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Tickers')
    )
  }

  public fetchTickersByConfig(config: TickersSearchConfig): void {
    this._tickersConfigSubject.next(config)
  }

  public fetchTickersByCursor(cursor: string): void {
    this._tickersCursorSubject.next(cursor)
  }

  public fetchTickerTypes(): void {
    this._typesSubject.next()
  }

  public fetchTickerDetails(tickerSymbol: string): void {
    this._tickerDetailsSubject.next(tickerSymbol)
  }

  private getTickersByConfig(searchConfig: TickersSearchConfig): Observable<TickersResponse> {
    let params = new HttpParams()
    if (searchConfig.type) {
      params = params.set('type', searchConfig.type)
    }
    if (searchConfig.searchTerm) {
      params = params.set('searchTerm', searchConfig.searchTerm)
    }
    if (searchConfig.symbol) {
      params = params.set('symbol', searchConfig.symbol)
    }
    const options = { params }

    return this._http
      .get<TickersResponse>(`${this._apiUrl}/stocks/reference/tickers`, options)
      .pipe(map((response) => ({ ...response, source: TickersResponseSource.CONFIG })))
  }

  private getTickersByCursor(cursor: string): Observable<TickersResponse> {
    return this._http
      .get<TickersResponse>(`${this._apiUrl}/stocks/reference/tickers/cursor/${cursor}`)
      .pipe(map((response) => ({ ...response, source: TickersResponseSource.CURSOR })))
  }

  private getTickerTypes(): Observable<TickerTypesResponse> {
    return this._http.get<TickerTypesResponse>(`${this._apiUrl}/stocks/reference/tickers/types`)
  }

  private getTickerDetails(tickerSymbol: string): Observable<TickerDetailsResponse> {
    return this._http.get<TickerDetailsResponse>(
      `${this._apiUrl}/stocks/reference/tickers/details/${tickerSymbol}`
    )
  }
}
