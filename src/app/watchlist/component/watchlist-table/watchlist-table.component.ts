import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { RouterModule } from '@angular/router'
import { FormatKeyPipe } from 'src/app/shared/pipe/format-key.pipe'
import { DailyBar, TickerSnapshotView, Watchlist, WatchlistView } from '../../model/watchlist'
import {
  EditDialogData,
  EditWatchlistDialogComponent
} from '../edit-watchlist-dialog/edit-watchlist-dialog.component'

@Component({
  selector: 'app-watchlist-table',
  standalone: true,
  imports: [RouterModule, FormatKeyPipe],
  templateUrl: './watchlist-table.component.html',
  styleUrl: './watchlist-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistTableComponent {
  @Input()
  public set watchlist(watchlist: Watchlist) {
    const watchlistView = this.fromWatchlistToWatchlistView(watchlist)
    this._watchlist.set(watchlistView)
  }

  public tableColumns: string[] = [
    'closePrice',
    'openPrice',
    'highestPrice',
    'lowestPrice',
    'volumeWeightedPrice'
  ]

  private _watchlist = signal<WatchlistView | null>(null)
  public watchlistSignal = this._watchlist.asReadonly()

  constructor(private _dialog: MatDialog) {}

  public openEditDialog(): void {
    const watchlistView = this._watchlist()
    if (!watchlistView) {
      return
    }
    const dialogData: EditDialogData = {
      watchlist: watchlistView
    }

    this._dialog.open(EditWatchlistDialogComponent, {
      width: '50vw',
      height: '90vh',
      hasBackdrop: true,
      data: dialogData
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
          id: snapShot.id,
          symbol: snapShot.symbol,
          name: snapShot.name,
          updated: snapShot.updated,
          dailyBar: snapShot.day?.tradingVolume > 0 ? snapShot.day : snapShot.prevDay
        }
      })
    return { id: watchlist.id, name: watchlist.name, tickerSnapshotViews: snapShotViews }
  }
}
