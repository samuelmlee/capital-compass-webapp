import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
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

  private _getTickersSubject = new Subject<void>()
  private _postWatchListSubject = new Subject<EditWatchlistConfig>()
  private _apiUrl = environment.apiUrl

  constructor(private _http: HttpClient) {
    this.watchListsSignal = fromObsToSignal<WatchlistCollectionResponse>(
      this._getTickersSubject.pipe(() => this.getUserWatchLists())
    )
  }

  public fetchWatchLists(): void {
    this._getTickersSubject.next()
  }

  private saveWatchList(config: EditWatchlistConfig): void {
    this._postWatchListSubject.next(config)
  }

  private getUserWatchLists(): Observable<WatchlistCollectionResponse> {
    return this._http.get<WatchlistCollectionResponse>(`${this._apiUrl}/users/watchlists`, { withCredentials: true })
  }

  private postUserWatchList(config: EditWatchlistConfig): Observable<WatchlistResponse> {
    return this._http.post<WatchlistResponse>(`${this._apiUrl}/users/watchlists`, config)
  }
}
