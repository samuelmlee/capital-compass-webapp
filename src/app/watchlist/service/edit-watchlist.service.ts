import { Injectable, signal } from '@angular/core'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import {
  CreateWatchlistConfig,
  EditWatchlistConfig,
  EditWatchlistState,
  WatchlistTicker
} from '../model/create-watchlist-config'
import { WatchlistView } from '../model/watchlist'
import { WatchlistService } from './watchlist.service'

@Injectable()
export class EditWatchlistService {
  private _watchlistState = signal<EditWatchlistState>({
    name: '',
    tickersSelected: []
  })
  public watchlistState = this._watchlistState.asReadonly()

  constructor(private _watchlistService: WatchlistService) {}

  public updateStateWithWatchlist(watchlist: WatchlistView): void {
    this._watchlistState.update(() => ({
      id: watchlist.id,
      name: watchlist.name,
      tickersSelected: watchlist.tickerSnapshotViews.map((snapshot) => ({
        name: snapshot.name,
        symbol: snapshot.symbol
      }))
    }))
  }

  public saveWatchList(): void {
    const editWatchlistState = this._watchlistState()

    if (editWatchlistState.id == null) {
      const config: CreateWatchlistConfig = {
        name: editWatchlistState.name,
        tickerSymbols: new Set(editWatchlistState.tickersSelected.map((ticker) => ticker.symbol))
      }
      return this._watchlistService.saveWatchList(config)
    }

    const editConfig: EditWatchlistConfig = {
      id: editWatchlistState.id,
      name: editWatchlistState.name,
      tickerSymbols: new Set(editWatchlistState.tickersSelected.map((ticker) => ticker.symbol))
    }
    this._watchlistService.saveWatchList(editConfig)
  }

  public addTickerResultToWatchList(result: TickersResult): void {
    if (this._watchlistState().tickersSelected.find((ticker) => ticker.symbol == result.symbol)) {
      return
    }
    const ticker: WatchlistTicker = { name: result.name, symbol: result.symbol }
    this._watchlistState.update((state) => ({
      ...state,
      tickersSelected: [...state.tickersSelected, ticker]
    }))
  }

  public removeTickerFromWatchList(ticker: WatchlistTicker): void {
    this._watchlistState.update((state) => {
      const updatedTickers = state.tickersSelected.filter((t) => t.symbol != ticker.symbol)
      return { ...state, tickersSelected: updatedTickers }
    })
  }

  public updateWatchlistName(name: string): void {
    this._watchlistState.update((state) => {
      return { ...state, name }
    })
  }
}
