import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, OnDestroy, Signal, signal } from '@angular/core'
import { Subscription, catchError, map, of } from 'rxjs'
import { environment } from 'src/environments/environment'
import { TickersResponse, TickersResponseResult, TickersResponseSource } from '../model/tickers-response'
import { TickersSearchConfig } from '../model/tickers-search-config'

@Injectable({
  providedIn: 'root'
})
export class TickerService implements OnDestroy {
  private tickersResponseSignal = signal<TickersResponseResult>({
    value: { results: [], nextCursor: '', source: null },
    error: null
  })

  private apiUrl = environment.apiUrl
  private tickersSubsription: Subscription | undefined

  public constructor(private http: HttpClient) {}

  public ngOnDestroy(): void {
    this.tickersSubsription?.unsubscribe()
  }

  public get tickersResponse(): Signal<TickersResponseResult> {
    return this.tickersResponseSignal.asReadonly()
  }

  public getTickersByConfig(searchConfig: TickersSearchConfig): void {
    this.tickersSubsription?.unsubscribe()
    const options = {
      params: new HttpParams()
        .set('ticker', searchConfig?.ticker ?? '')
        .set('search-term', searchConfig?.searchTerm ?? '')
    }

    this.tickersSubsription = this.http
      .get<TickersResponse>(`${this.apiUrl}/stocks/tickers`, options)
      .pipe(
        map(
          (response) => ({ value: { ...response, source: TickersResponseSource.CONFIG }, error: null }),
          catchError((err) => of({ value: null, error: err }))
        )
      )
      .subscribe((response) => this.tickersResponseSignal.set(response))
  }

  public getTickersByCursor(cursor: string): void {
    this.tickersSubsription?.unsubscribe()

    this.tickersSubsription = this.http
      .get<TickersResponse>(`${this.apiUrl}/stocks/tickers/${cursor}`)
      .pipe(
        map(
          (response) => ({ value: { ...response, source: TickersResponseSource.CURSOR }, error: null }),
          catchError((err) => of({ value: null, error: err }))
        )
      )
      .subscribe((response) => this.tickersResponseSignal.set(response))
  }
}
