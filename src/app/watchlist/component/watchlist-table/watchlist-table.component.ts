import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { RouterModule } from '@angular/router'
import { FormatKeyPipe } from 'src/app/shared/pipe/format-key.pipe'
import { DailyBar, TickerSnapshotView, Watchlist, WatchlistView } from '../../model/watchlist'
import { WatchDialogData } from '../../model/watchlist-dialog-data'
import { WatchlistService } from '../../service/watchlist.service'
import { DeleteWatchlistDialogComponent } from '../delete-watchlist-dialog/delete-watchlist-dialog.component'
import { ManageWatchlistDialogComponent } from '../manage-watchlist-dialog/manage-watchlist-dialog.component'

@Component({
  selector: 'app-watchlist-table',
  standalone: true,
  imports: [MatButtonModule, RouterModule, FormatKeyPipe],
  templateUrl: './watchlist-table.component.html',
  styleUrl: './watchlist-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistTableComponent {
  @Input()
  public set watchlist(watchlist: Watchlist) {
    const watchlistView = this.fromWatchlistToWatchlistView(watchlist)
    this._$watchlist.set(watchlistView)
  }

  public tableColumns: string[] = [
    'closePrice',
    'openPrice',
    'highestPrice',
    'lowestPrice',
    'volumeWeightedPrice'
  ]

  private _$watchlist = signal<WatchlistView | null>(null)
  public $watchlist = this._$watchlist.asReadonly()

  constructor(
    private _dialog: MatDialog,
    private _watchlistService: WatchlistService
  ) {}

  public openEditDialog(): void {
    const watchlistView = this._$watchlist()
    if (!watchlistView) {
      return
    }
    const dialogData: WatchDialogData = {
      watchlist: watchlistView
    }

    const dialogRef = this._dialog.open(ManageWatchlistDialogComponent, {
      width: '50vw',
      height: '90vh',
      hasBackdrop: true,
      data: dialogData,
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(() => {
      this._watchlistService.fetchWatchLists()
    })
  }

  public openDeleteDialog(): void {
    const watchlistView = this._$watchlist()
    if (!watchlistView) {
      return
    }
    const dialogData: WatchDialogData = {
      watchlist: watchlistView
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

  public resolveDailyBarValue(dailyBar: DailyBar, key: string): string | number {
    if (!dailyBar) {
      return ''
    }
    return dailyBar[key as keyof DailyBar]
  }

  private fromWatchlistToWatchlistView(watchlist: Watchlist): WatchlistView {
    const snapShotViews: TickerSnapshotView[] = watchlist.tickerSnapshots
      .sort((a, b) => (a.symbol > b.symbol ? 1 : -1))
      .map((snapShot) => {
        return {
          symbol: snapShot.symbol,
          name: snapShot.name,
          updated: snapShot.updated,
          dailyBar: snapShot.day?.tradingVolume > 0 ? snapShot.day : snapShot.prevDay
        }
      })
    return { id: watchlist.id, name: watchlist.name, tickerSnapshotViews: snapShotViews }
  }
}
