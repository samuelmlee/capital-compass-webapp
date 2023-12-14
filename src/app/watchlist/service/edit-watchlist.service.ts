import { Injectable, Signal, signal } from '@angular/core'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import { EditWatchlistConfig } from '../model/create-watchlist-config'
import { WatchlistService } from './watchlist.service'

@Injectable({
  providedIn: 'root'
})
export class EditWatchlistService {
  private _tickersSelected = signal<Set<TickersResult>>(new Set())
  private _watchlistName = ''

  public get tickersSelected(): Signal<Set<TickersResult>> {
    return this._tickersSelected.asReadonly()
  }

  constructor(private _watchlistService: WatchlistService) {}

  public saveWatchList(): void {
    const config: EditWatchlistConfig = {
      name: this._watchlistName,
      tickerSymbols: new Set<string>([...this._tickersSelected()].map((ticker) => ticker.ticker))
    }
    this._watchlistService.saveWatchList(config)
  }

  public addTickerToWatchList(ticker: TickersResult): void {
    this._tickersSelected.update((selected) => selected.add(ticker))
  }

  public removeTickerFromWatchList(ticker: TickersResult): void {
    this._tickersSelected.update((selected) => {
      selected.delete(ticker)
      return selected
    })
  }

  public updateWatchlistName(name: string): void {
    this._watchlistName = name
  }
}
