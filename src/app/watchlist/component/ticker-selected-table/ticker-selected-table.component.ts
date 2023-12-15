import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import { WatchlistTicker } from '../../model/create-watchlist-config'
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
  public tickersSelected = computed(
    () => this._editWatchlistService.watchlistState().tickersSelected
  )

  constructor(private _editWatchlistService: EditWatchlistService) {}

  public removeTickerFromWatchList(ticker: WatchlistTicker): void {
    this._editWatchlistService.removeTickerFromWatchList(ticker)
  }
}
