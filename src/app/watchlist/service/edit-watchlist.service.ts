import { Injectable, signal } from '@angular/core'
import { Result } from 'src/app/shared/model/result'
import { EditWatchlistConfig, WatchlistEdited } from '../model/edit-watchlist-config'
import { WatchlistView } from '../model/watchlist'
import { BaseWatchlistService } from './base-watchlist.service'

@Injectable()
export class EditWatchlistService extends BaseWatchlistService {
  public override watchlistResult: Result<WatchlistEdited> | undefined =
    this._watchlistService.watchlistUpdatedResult

  private _$savedWatchlistConfig = signal<EditWatchlistConfig | null>(null)

  public override $savedWatchlistConfig = this._$savedWatchlistConfig.asReadonly()

  public updateStateWithWatchlist(watchlist: WatchlistView): void {
    this._$watchlistState.update(() => ({
      id: watchlist.id,
      name: watchlist.name,
      tickersSelected: watchlist.tickerSnapshotViews.map((snapshot) => ({
        name: snapshot.name,
        symbol: snapshot.symbol
      }))
    }))
  }

  public saveWatchList(): void {
    const editWatchlistState = this._$watchlistState()

    if (!editWatchlistState.id) {
      return
    }

    const editConfig: EditWatchlistConfig = {
      id: editWatchlistState.id,
      name: editWatchlistState.name,
      tickerSymbols: new Set(editWatchlistState.tickersSelected.map((ticker) => ticker.symbol))
    }

    this._$savedWatchlistConfig.set(editConfig)

    this._watchlistService.updateWatchList(editConfig)
  }
}
