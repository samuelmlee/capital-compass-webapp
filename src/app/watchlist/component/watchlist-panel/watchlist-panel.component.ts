import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, computed, effect } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { EditWatchlistConfig } from '../../model/create-watchlist-config'
import { WatchlistService } from '../../service/watchlist.service'
import { CreateWatchlistDialogComponent } from '../create-watchlist-dialog/create-watchlist-dialog.component'
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

  public openCreateDialog(): void {
    const dialogRef = this._dialog.open(CreateWatchlistDialogComponent, {
      width: '50vw',
      hasBackdrop: true
    })

    dialogRef.afterClosed().subscribe((config: EditWatchlistConfig) => {
      this._watchlistService.saveWatchList(config)
    })
  }
}
