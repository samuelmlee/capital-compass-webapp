import { Injectable } from '@angular/core'
import { CreateWatchlistConfig, EditWatchlistConfig } from '../model/edit-watchlist-config'
import { WatchlistView } from '../model/watchlist'
import { BaseWatchlistService } from './base-watchlist.service'

@Injectable()
export class EditWatchlistService extends BaseWatchlistService {
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

    if (editWatchlistState.id == null) {
      const config: CreateWatchlistConfig = {
        name: editWatchlistState.name,
        tickerSymbols: new Set(editWatchlistState.tickersSelected.map((ticker) => ticker.symbol))
      }
      return this._watchlistService.createWatchList(config)
    }

    const editConfig: EditWatchlistConfig = {
      id: editWatchlistState.id,
      name: editWatchlistState.name,
      tickerSymbols: new Set(editWatchlistState.tickersSelected.map((ticker) => ticker.symbol))
    }
    this._watchlistService.updateWatchList(editConfig)
  }

  public deleteWatchList(): void {
    const editWatchlistState = this._$watchlistState()
    if (!editWatchlistState.id) {
      return
    }
    this._watchlistService.deleteWatchlist(editWatchlistState.id)
  }
}
