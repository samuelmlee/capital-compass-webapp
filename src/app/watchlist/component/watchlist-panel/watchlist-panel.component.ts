import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { EditWatchlistConfig } from '../../model/create-watchlist-config'
import { WatchlistService } from '../../service/watchlist.service'
import { CreateWatchlistDialogComponent } from '../create-watchlist-dialog/create-watchlist-dialog.component'

@Component({
  selector: 'app-watch-list-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist-panel.component.html',
  styleUrl: './watchlist-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistPanelComponent implements OnInit {
  public watchListsSignal = this._watchlistService.watchListsSignal
  private _watchListCreatedSignal = this._watchlistService.watchListCreatedSignal

  constructor(
    private _dialog: MatDialog,
    private _watchlistService: WatchlistService
  ) {
    effect(() => {
      if (this._watchListCreatedSignal.value()) {
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
