import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, map, switchMap } from 'rxjs'
import { environment } from '../../../environments/environment'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { LoadingService } from '../../core/service/loading.service'
import { Result } from '../../shared/model/result'
import { fromObsToSignal } from '../../shared/utils/from-obs-to-signal'
import {
  CreateWatchlistConfig,
  EditWatchlistConfig,
  WatchlistEdited
} from '../model/edit-watchlist-config'
import { Watchlist } from '../model/watchlist'

@Injectable()
export class WatchlistService {
  public watchlistsResult: Result<Watchlist[]>
  public watchlistCreatedResult: Result<WatchlistEdited>
  public watchlistUpdatedResult: Result<WatchlistEdited>
  public watchlistDeletedResult: Result<number>

  private _getTickersSubject = new Subject<void>()
  private _postWatchListSubject = new Subject<CreateWatchlistConfig>()
  private _putWatchListSubject = new Subject<EditWatchlistConfig>()
  private _deleteWatchListSubject = new Subject<number>()

  private _apiUrl = environment.apiUrl
  private _getWatchListsUrl = `${this._apiUrl}/gateway/watchlists`

  public fetchWatchListsLoading = this._loadingService.isLoading(this._getWatchListsUrl)

  constructor(
    private _http: HttpClient,
    private _errorHandlingService: ErrorHandlingService,
    private _loadingService: LoadingService
  ) {
    this.watchlistsResult = fromObsToSignal<Watchlist[]>(
      this._getTickersSubject.pipe(switchMap(() => this.getUserWatchLists())),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Watchlist')
    )

    this.watchlistCreatedResult = fromObsToSignal<WatchlistEdited>(
      this._postWatchListSubject.pipe(switchMap((config) => this.postUserWatchList(config))),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Watchlist')
    )

    this.watchlistUpdatedResult = fromObsToSignal<WatchlistEdited>(
      this._putWatchListSubject.pipe(switchMap((config) => this.putUserWatchList(config))),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Watchlist')
    )

    this.watchlistDeletedResult = fromObsToSignal<number>(
      this._deleteWatchListSubject.pipe(switchMap((id) => this.deleteUserWatchList(id))),
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

  private getUserWatchLists(): Observable<Watchlist[]> {
    return this._http.get<Watchlist[]>(this._getWatchListsUrl, {
      withCredentials: true
    })
  }

  private postUserWatchList(config: CreateWatchlistConfig): Observable<WatchlistEdited> {
    return this._http.post<WatchlistEdited>(
      `${this._apiUrl}/users/watchlists`,
      { ...config, tickerSymbols: [...config.tickerSymbols] },
      {
        withCredentials: true
      }
    )
  }

  private putUserWatchList(config: EditWatchlistConfig): Observable<WatchlistEdited> {
    return this._http.put<WatchlistEdited>(
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
