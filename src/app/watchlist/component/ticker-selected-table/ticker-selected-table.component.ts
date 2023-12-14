import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import { EditWatchlistService } from '../../service/edit-watchlist.service'

@Component({
  selector: 'app-ticker-selected-table',
  standalone: true,
  imports: [],
  templateUrl: './ticker-selected-table.component.html',
  styleUrl: './ticker-selected-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerSelectedTableComponent {
  constructor(private _watchlistTickersService: EditWatchlistService) {}

  public tickersSelected = this._watchlistTickersService.tickersSelected

  public addTickerToWatchList(ticker: TickersResult): void {
    this._watchlistTickersService.addTickerToWatchList(ticker)
  }

  public removeTickerFromWatchList(ticker: TickersResult): void {
    this._watchlistTickersService.removeTickerFromWatchList(ticker)
  }
}
