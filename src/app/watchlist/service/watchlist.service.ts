import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, map, switchMap, tap } from 'rxjs'
import { ErrorHandlingService } from 'src/app/core/service/error-handling.service'
import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { CreateWatchlistConfig, EditWatchlistConfig } from '../model/edit-watchlist-config'
import { Watchlist } from '../model/watchlist'
import { WatchlistCollectionResponse } from '../model/watchlist-collection-response'

@Injectable()
export class WatchlistService {
  public watchlistsResult: Result<WatchlistCollectionResponse>
  public watchlistCreatedResult: Result<Watchlist>
  public watchlistUpdatedResult: Result<Watchlist>
  public watchlistDeletedResult: Result<number>

  private _getTickersSubject = new Subject<void>()
  private _postWatchListSubject = new Subject<CreateWatchlistConfig>()
  private _putWatchListSubject = new Subject<EditWatchlistConfig>()
  private _deleteWatchListSubject = new Subject<number>()

  private _apiUrl = environment.apiUrl

  constructor(
    private _http: HttpClient,
    private _errorHandlingService: ErrorHandlingService
  ) {
    this.watchlistsResult = fromObsToSignal<WatchlistCollectionResponse>(
      this._getTickersSubject.pipe(switchMap(() => this.getUserWatchLists())),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Watchlist')
    )

    this.watchlistCreatedResult = fromObsToSignal<Watchlist>(
      this._postWatchListSubject.pipe(
        switchMap((config) => this.postUserWatchList(config)),
        tap(() => this.fetchWatchLists())
      ),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Watchlist')
    )

    this.watchlistUpdatedResult = fromObsToSignal<Watchlist>(
      this._putWatchListSubject.pipe(
        switchMap((config) => this.putUserWatchList(config)),
        tap(() => this.fetchWatchLists())
      ),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Watchlist')
    )

    this.watchlistDeletedResult = fromObsToSignal<number>(
      this._deleteWatchListSubject.pipe(
        switchMap((id) => this.deleteUserWatchList(id)),
        tap(() => this.fetchWatchLists())
      ),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Watchlist')
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

  private deleteUserWatchList(watchlistId: number): Observable<number> {
    return this._http
      .delete<number>(`${this._apiUrl}/users/watchlists/${watchlistId}`, {
        withCredentials: true
      })
      .pipe(map(() => watchlistId))
  }
}
