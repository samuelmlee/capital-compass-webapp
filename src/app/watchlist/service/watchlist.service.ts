import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, map, switchMap } from 'rxjs'
import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { CreateWatchlistConfig, EditWatchlistConfig } from '../model/edit-watchlist-config'
import { Watchlist } from '../model/watchlist'
import { WatchlistCollectionResponse } from '../model/watchlist-collection-response'

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  public watchlistsSignal: Result<WatchlistCollectionResponse>
  public watchlistCreatedSignal: Result<Watchlist>
  public watchlistUpdatedSignal: Result<Watchlist>
  public watchlistDeletedSignal: Result<boolean>

  private _getTickersSubject = new Subject<void>()
  private _postWatchListSubject = new Subject<CreateWatchlistConfig>()
  private _putWatchListSubject = new Subject<EditWatchlistConfig>()
  private _deleteWatchListSubject = new Subject<number>()

  private _apiUrl = environment.apiUrl

  constructor(private _http: HttpClient) {
    this.watchlistsSignal = fromObsToSignal<WatchlistCollectionResponse>(
      this._getTickersSubject.pipe(switchMap(() => this.getUserWatchLists()))
    )

    this.watchlistCreatedSignal = fromObsToSignal<Watchlist>(
      this._postWatchListSubject.pipe(switchMap((config) => this.postUserWatchList(config)))
    )

    this.watchlistUpdatedSignal = fromObsToSignal<Watchlist>(
      this._putWatchListSubject.pipe(switchMap((config) => this.putUserWatchList(config)))
    )

    this.watchlistDeletedSignal = fromObsToSignal<boolean>(
      this._deleteWatchListSubject.pipe(
        switchMap((id) => this.deleteUserWatchList(id).pipe(map(() => true)))
      )
    )
  }

  public fetchWatchLists(): void {
    this._getTickersSubject.next()
  }

  public createWatchList(config: CreateWatchlistConfig): void {
    this._postWatchListSubject.next(config)
  }

  public updateWatchList(config: EditWatchlistConfig): void {
    this._putWatchListSubject.next(config)
  }

  public deleteWatchlist(id: number): void {
    this._deleteWatchListSubject.next(id)
  }

  private getUserWatchLists(): Observable<WatchlistCollectionResponse> {
    return this._http.get<WatchlistCollectionResponse>(`${this._apiUrl}/gateway/watchlists`, {
      withCredentials: true
    })
  }

  private postUserWatchList(config: CreateWatchlistConfig): Observable<Watchlist> {
    return this._http.post<Watchlist>(
      `${this._apiUrl}/users/watchlists`,
      { ...config, tickerSymbols: [...config.tickerSymbols] },
      {
        withCredentials: true
      }
    )
  }

  private putUserWatchList(config: EditWatchlistConfig): Observable<Watchlist> {
    return this._http.put<Watchlist>(
      `${this._apiUrl}/users/watchlists`,
      { ...config, tickerSymbols: [...config.tickerSymbols] },
      {
        withCredentials: true
      }
    )
  }

  private deleteUserWatchList(watchlistId: number): Observable<boolean> {
    return this._http.delete<boolean>(`${this._apiUrl}/users/watchlists/${watchlistId}`, {
      withCredentials: true
    })
  }
}
