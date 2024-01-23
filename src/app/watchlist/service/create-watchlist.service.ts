import { Injectable } from '@angular/core'
import { Result } from 'src/app/shared/model/result'
import { CreateWatchlistConfig } from '../model/edit-watchlist-config'
import { Watchlist } from '../model/watchlist'
import { BaseWatchlistService } from './base-watchlist.service'

@Injectable()
export class CreateWatchlistService extends BaseWatchlistService {
  public override watchlistResult: Result<Watchlist> | undefined =
    this._watchlistService.watchlistCreatedResult

  public saveWatchList(): void {
    const editWatchlistState = this._$watchlistState()

    const config: CreateWatchlistConfig = {
      name: editWatchlistState.name,
      tickerSymbols: new Set(editWatchlistState.tickersSelected.map((ticker) => ticker.symbol))
    }

    this._watchlistService.createWatchList(config)
  }
}
