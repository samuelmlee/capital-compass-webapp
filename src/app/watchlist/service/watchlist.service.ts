import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { EditWatchListConfig } from '../model/create-watchlist-config'
import { WatchListCollectionResponse } from '../model/watchList-collection-response'
import { WatchListResponse } from '../model/watchList-response'

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  public watchListSignal: Result<WatchListCollectionResponse>

  private _getTickersSubject = new Subject<void>()
  private _postWatchListSubject = new Subject<EditWatchListConfig>()
  private _apiUrl = environment.apiUrl

  constructor(private _http: HttpClient) {
    this.watchListSignal = fromObsToSignal<WatchListCollectionResponse>(
      this._getTickersSubject.pipe(() => this.getUserWatchLists())
    )
  }

  public fetchWatchLists(): void {
    this._getTickersSubject.next()
  }

  private saveWatchList(config: EditWatchListConfig): void {
    this._postWatchListSubject.next(config)
  }

  private getUserWatchLists(): Observable<WatchListCollectionResponse> {
    return this._http.get<WatchListCollectionResponse>(`${this._apiUrl}/users/watchlists`)
  }

  private postUserWatchList(config: EditWatchListConfig): Observable<WatchListResponse> {
    return this._http.post<WatchListResponse>(`${this._apiUrl}/users/watchlists`, config)
  }
}
