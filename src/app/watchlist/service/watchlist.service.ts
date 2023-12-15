import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, switchMap } from 'rxjs'
import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { CreateWatchlistConfig } from '../model/create-watchlist-config'
import { Watchlist } from '../model/watchlist'
import { WatchlistCollectionResponse } from '../model/watchlist-collection-response'

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  public watchlistsSignal: Result<WatchlistCollectionResponse>
  public watchlistCreatedSignal: Result<Watchlist>

  private _getTickersSubject = new Subject<void>()
  private _postWatchListSubject = new Subject<CreateWatchlistConfig>()
  private _apiUrl = environment.apiUrl

  constructor(private _http: HttpClient) {
    this.watchlistsSignal = fromObsToSignal<WatchlistCollectionResponse>(
      this._getTickersSubject.pipe(switchMap(() => this.getUserWatchLists()))
    )

    this.watchlistCreatedSignal = fromObsToSignal<Watchlist>(
      this._postWatchListSubject.pipe(switchMap((config) => this.postUserWatchList(config)))
    )
  }

  public fetchWatchLists(): void {
    this._getTickersSubject.next()
  }

  public saveWatchList(config: CreateWatchlistConfig): void {
    this._postWatchListSubject.next(config)
  }

  private getUserWatchLists(): Observable<WatchlistCollectionResponse> {
    return this._http.get<WatchlistCollectionResponse>(`${this._apiUrl}/gateway/watchlists`, {
      withCredentials: true
    })
  }

  private postUserWatchList(config: CreateWatchlistConfig): Observable<Watchlist> {
    const requestConfig = { name: config.name, tickers: Array.from(config.tickerSymbols) }
    return this._http.post<Watchlist>(`${this._apiUrl}/users/watchlists`, requestConfig, {
      withCredentials: true
    })
  }
}
