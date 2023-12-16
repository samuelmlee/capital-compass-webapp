import { Injectable, signal } from '@angular/core'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import {
  CreateWatchlistConfig,
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
    const config: CreateWatchlistConfig = {
      name: editWatchlistState.name,
      tickers: editWatchlistState.tickersSelected
    }
    this._watchlistService.saveWatchList(config)
  }

  public addTickerResultToWatchList(result: TickersResult): void {
    if (this._watchlistState().tickersSelected.find((ticker) => ticker.symbol == result.symbol)) {
      return
    }
    const ticker: WatchlistTicker = { name: result.name, symbol: result.symbol }
    this._watchlistState.update((state) => ({
      name: state.name,
      tickersSelected: [...state.tickersSelected, ticker]
    }))
  }

  public removeTickerFromWatchList(ticker: WatchlistTicker): void {
    this._watchlistState.update((state) => {
      const updatedTickers = state.tickersSelected.filter((t) => t.symbol != ticker.symbol)
      return { name: state.name, tickersSelected: updatedTickers }
    })
  }

  public updateWatchlistName(name: string): void {
    this._watchlistState.update((state) => {
      return { name, tickersSelected: state.tickersSelected }
    })
  }
}
