import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, computed, effect } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { WatchlistService } from '../../service/watchlist.service'
import { EditWatchlistDialogComponent } from '../edit-watchlist-dialog/edit-watchlist-dialog.component'
import { WatchlistTableComponent } from '../watchlist-table/watchlist-table.component'

@Component({
  selector: 'app-watch-list-panel',
  standalone: true,
  imports: [CommonModule, WatchlistTableComponent],
  templateUrl: './watchlist-panel.component.html',
  styleUrl: './watchlist-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistPanelComponent implements OnInit {
  public watchlistsSignal = computed(() => {
    const watchlists = this._watchlistService.watchlistsSignal.value()
    return watchlists?.sort((a, b) => (a.name < b.name ? -1 : 1))
  })
  private _watchlistCreatedSignal = this._watchlistService.watchlistCreatedSignal

  constructor(
    private _dialog: MatDialog,
    private _watchlistService: WatchlistService
  ) {
    effect(() => {
      if (this._watchlistCreatedSignal.value()) {
        this._watchlistService.fetchWatchLists()
      }
    })
  }
  public ngOnInit(): void {
    this._watchlistService.fetchWatchLists()
  }

  public openEditDialog(): void {
    this._dialog.open(EditWatchlistDialogComponent, {
      width: '50vw',
      height: '95vh',
      hasBackdrop: true
    })
  }
}
