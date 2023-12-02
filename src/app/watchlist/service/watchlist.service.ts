import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, switchMap } from 'rxjs'
import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { EditWatchlistConfig } from '../model/create-watchlist-config'
import { WatchlistCollectionResponse } from '../model/watchList-collection-response'
import { WatchlistResponse } from '../model/watchList-response'

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  public watchListsSignal: Result<WatchlistCollectionResponse>
  public watchListCreatedSignal: Result<WatchlistResponse>

  private _getTickersSubject = new Subject<void>()
  private _postWatchListSubject = new Subject<EditWatchlistConfig>()
  private _apiUrl = environment.apiUrl

  constructor(private _http: HttpClient) {
    this.watchListsSignal = fromObsToSignal<WatchlistCollectionResponse>(
      this._getTickersSubject.pipe(switchMap(() => this.getUserWatchLists()))
    )

    this.watchListCreatedSignal = fromObsToSignal<WatchlistResponse>(
      this._postWatchListSubject.pipe(switchMap((config) => this.postUserWatchList(config)))
    )
  }

  public fetchWatchLists(): void {
    this._getTickersSubject.next()
  }

  public saveWatchList(config: EditWatchlistConfig): void {
    this._postWatchListSubject.next(config)
  }

  private getUserWatchLists(): Observable<WatchlistCollectionResponse> {
    // TODO: send requests to Gateway when aggregation implemented
    return this._http.get<WatchlistCollectionResponse>(`${this._apiUrl}/users/watchlists`, { withCredentials: true })
  }

  private postUserWatchList(config: EditWatchlistConfig): Observable<WatchlistResponse> {
    const requestConfig = { name: config.name, tickers: Array.from(config.tickerSymbols) }
    return this._http.post<WatchlistResponse>(`${this._apiUrl}/users/watchlists`, requestConfig, {
      withCredentials: true
    })
  }
}
