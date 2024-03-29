import { Injectable } from '@angular/core'
import { Result } from 'src/app/shared/model/result'
import { EditWatchlistConfig, WatchlistEdited } from '../model/edit-watchlist-config'
import { Watchlist } from '../model/watchlist'
import { BaseWatchlistService } from './base-watchlist.service'

@Injectable()
export class EditWatchlistService extends BaseWatchlistService {
  public override watchlistResult: Result<WatchlistEdited> | undefined =
    this._watchlistService.watchlistUpdatedResult

  public updateStateWithWatchlist(watchlist: Watchlist): void {
    this._$watchlistState.update(() => ({
      id: watchlist.id,
      name: watchlist.name,
      tickersSelected: watchlist.tickerSnapshots.map((snapshot) => ({
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

    this._watchlistService.updateWatchList(editConfig)
  }
}
