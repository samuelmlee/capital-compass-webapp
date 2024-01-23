import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { WatchlistTicker } from '../../model/edit-watchlist-config'
import { BaseWatchlistService } from '../../service/base-watchlist.service'

@Component({
  selector: 'app-ticker-selected-table',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './ticker-selected-table.component.html',
  styleUrl: './ticker-selected-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerSelectedTableComponent {
  public $tickersSelected = computed(
    () => this._baseWatchlistService.$watchlistState().tickersSelected
  )

  constructor(private _baseWatchlistService: BaseWatchlistService) {}

  public removeTickerFromWatchList(ticker: WatchlistTicker): void {
    this._baseWatchlistService.removeTickerFromWatchList(ticker)
  }
}
