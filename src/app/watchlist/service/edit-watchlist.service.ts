import { Injectable, signal } from '@angular/core'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import {
  CreateWatchlistConfig,
  EditWatchlistState,
  WatchlistTicker
} from '../model/create-watchlist-config'
import { WatchlistService } from './watchlist.service'

@Injectable()
export class EditWatchlistService {
  private _watchlistState = signal<EditWatchlistState>({
    name: '',
    tickersSelected: new Set<WatchlistTicker>()
  })

  public watchlistState = this._watchlistState.asReadonly()

  constructor(private _watchlistService: WatchlistService) {}

  public saveWatchList(): void {
    const editWatchlistState = this._watchlistState()
    const config: CreateWatchlistConfig = {
      name: editWatchlistState.name,
      tickerSymbols: editWatchlistState.tickersSelected
    }
    this._watchlistService.saveWatchList(config)
  }

  public addTickerResultToWatchList(result: TickersResult): void {
    const ticker: WatchlistTicker = { name: result.name, ticker: result.ticker }
    this._watchlistState.update((state) => ({
      name: state.name,
      tickersSelected: new Set([...state.tickersSelected, ticker])
    }))
  }

  public removeTickerFromWatchList(ticker: WatchlistTicker): void {
    this._watchlistState.update((state) => {
      state.tickersSelected.delete(ticker)
      return { name: state.name, tickersSelected: new Set([...state.tickersSelected]) }
    })
  }

  public updateWatchlistName(name: string): void {
    this._watchlistState.update((state) => ({ name, tickersSelected: state.tickersSelected }))
  }
}
