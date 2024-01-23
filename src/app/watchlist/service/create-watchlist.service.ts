import { Injectable } from '@angular/core'
import { CreateWatchlistConfig } from '../model/edit-watchlist-config'
import { BaseWatchlistService } from './base-watchlist.service'

@Injectable()
export class CreateWatchlistService extends BaseWatchlistService {
  public saveWatchList(): void {
    const editWatchlistState = this._$watchlistState()

    const config: CreateWatchlistConfig = {
      name: editWatchlistState.name,
      tickerSymbols: new Set(editWatchlistState.tickersSelected.map((ticker) => ticker.symbol))
    }

    this._watchlistService.createWatchList(config)
  }
}
