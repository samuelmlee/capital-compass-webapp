import { Injectable, signal } from '@angular/core'
import { Result } from 'src/app/shared/model/result'
import { CreateWatchlistConfig, WatchlistEdited } from '../model/edit-watchlist-config'
import { BaseWatchlistService } from './base-watchlist.service'

@Injectable()
export class CreateWatchlistService extends BaseWatchlistService {
  public override watchlistResult: Result<WatchlistEdited> | undefined =
    this._watchlistService.watchlistCreatedResult

  private _$savedWatchlistConfig = signal<CreateWatchlistConfig | null>(null)

  public override $savedWatchlistConfig = this._$savedWatchlistConfig.asReadonly()

  public saveWatchList(): void {
    const editWatchlistState = this._$watchlistState()

    const config: CreateWatchlistConfig = {
      name: editWatchlistState.name,
      tickerSymbols: new Set(editWatchlistState.tickersSelected.map((ticker) => ticker.symbol))
    }

    this._$savedWatchlistConfig.set(config)

    this._watchlistService.createWatchList(config)
  }
}
