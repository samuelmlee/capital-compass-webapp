import { Injectable, signal } from '@angular/core'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import {
  CreateWatchlistConfig,
  EditWatchlistConfig,
  EditWatchlistState,
  WatchlistTicker
} from '../model/edit-watchlist-config'
import { WatchlistView } from '../model/watchlist'
import { WatchlistService } from './watchlist.service'

@Injectable()
export class EditWatchlistService {
  private _$watchlistState = signal<EditWatchlistState>({
    name: '',
    tickersSelected: []
  })
  public $watchlistState = this._$watchlistState.asReadonly()

  constructor(private _watchlistService: WatchlistService) {}

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
