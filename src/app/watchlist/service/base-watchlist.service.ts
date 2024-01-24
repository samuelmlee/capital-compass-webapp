import { Injectable, Signal, signal } from '@angular/core'
import { Result } from 'src/app/shared/model/result'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import {
  CreateWatchlistConfig,
  EditWatchlistConfig,
  EditWatchlistState,
  WatchlistEdited,
  WatchlistTicker
} from '../model/edit-watchlist-config'
import { WatchlistService } from './watchlist.service'

@Injectable()
export abstract class BaseWatchlistService {
  public watchlistResult: Result<WatchlistEdited> | undefined

  public $savedWatchlistConfig:
    | Signal<CreateWatchlistConfig | EditWatchlistConfig | null>
    | undefined

  protected _$watchlistState = signal<EditWatchlistState>({
    name: '',
    tickersSelected: []
  })
  public $watchlistState = this._$watchlistState.asReadonly()

  constructor(protected _watchlistService: WatchlistService) {}

  public abstract saveWatchList(): void

  public addTickerResultToWatchList(result: TickersResult): void {
    if (this._$watchlistState().tickersSelected.find((ticker) => ticker.symbol == result.symbol)) {
      return
    }
    const ticker: WatchlistTicker = { name: result.name, symbol: result.symbol }
    this._$watchlistState.update((state) => ({
      ...state,
      tickersSelected: [...state.tickersSelected, ticker]
    }))
  }

  public removeTickerFromWatchList(ticker: WatchlistTicker): void {
    this._$watchlistState.update((state) => {
      const updatedTickers = state.tickersSelected.filter((t) => t.symbol != ticker.symbol)
      return { ...state, tickersSelected: updatedTickers }
    })
  }

  public updateWatchlistName(name: string): void {
    this._$watchlistState.update((state) => {
      return { ...state, name }
    })
  }
}
