import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
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
  public tickersSelected = this._editWatchlistService.tickersSelected

  constructor(private _editWatchlistService: EditWatchlistService) {}

  public removeTickerFromWatchList(ticker: TickersResult): void {
    this._editWatchlistService.removeTickerFromWatchList(ticker)
  }
}
