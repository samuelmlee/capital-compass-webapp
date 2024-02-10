import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { FormatKeyPipe } from 'src/app/shared/pipe/format-key.pipe'
import { CLOSE_DIALOG_SOURCE } from '../../model/edit-watchlist-config'
import { Watchlist } from '../../model/watchlist'
import { WatchDialogData } from '../../model/watchlist-dialog-data'
import { WatchlistService } from '../../service/watchlist.service'
import { DeleteWatchlistDialogComponent } from '../delete-watchlist-dialog/delete-watchlist-dialog.component'
import { ManageWatchlistDialogComponent } from '../manage-watchlist-dialog/manage-watchlist-dialog.component'
import { WatchlistTableRowComponent } from './watchlist-table-row/watchlist-table-row.component'

@Component({
  selector: 'app-watchlist-table',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormatKeyPipe, WatchlistTableRowComponent],
  templateUrl: './watchlist-table.component.html',
  styleUrl: './watchlist-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistTableComponent {
  @Input()
  public set watchlist(watchlist: Watchlist) {
    watchlist.tickerSnapshots.sort((a, b) => (a.symbol > b.symbol ? 1 : -1))
    this._$watchlist.set(watchlist)
  }

  public tableColumns: string[] = [
    'closePrice',
    'openPrice',
    'highestPrice',
    'lowestPrice',
    'volumeWeightedPrice'
  ]

  private _$watchlist = signal<Watchlist | null>(null)
  public $watchlist = this._$watchlist.asReadonly()

  constructor(
    private _dialog: MatDialog,
    private _watchlistService: WatchlistService
  ) {}

  public openEditDialog(): void {
    const watchlist = this._$watchlist()
    if (!watchlist) {
      return
    }
    const dialogData: WatchDialogData = {
      watchlist: watchlist
    }

    const dialogRef = this._dialog.open<
      ManageWatchlistDialogComponent,
      WatchDialogData,
      CLOSE_DIALOG_SOURCE
    >(ManageWatchlistDialogComponent, {
      width: '50vw',
      height: '90vh',
      hasBackdrop: true,
      data: dialogData,
      disableClose: true
    })

    dialogRef.afterClosed().subscribe((result: CLOSE_DIALOG_SOURCE | undefined) => {
      if (result === CLOSE_DIALOG_SOURCE.SAVE) {
        this._watchlistService.fetchWatchLists()
      }
    })
  }

  public openDeleteDialog(): void {
    const watchlist = this._$watchlist()
    if (!watchlist) {
      return
    }
    const dialogData: WatchDialogData = {
      watchlist: watchlist
    }

    const dialogRef = this._dialog.open(DeleteWatchlistDialogComponent, {
      width: '25vw',
      height: '25vh',
      hasBackdrop: true,
      data: dialogData
    })

    dialogRef.afterClosed().subscribe(() => {
      this._watchlistService.fetchWatchLists()
    })
  }
}
