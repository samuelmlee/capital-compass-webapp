import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { TickerMessage } from 'src/app/shared/model/ticker-message'
import { FormatKeyPipe } from 'src/app/shared/pipe/format-key.pipe'
import {
  DailyBar,
  DailyBarView,
  PriceChange,
  TickerSnapshotView,
  Watchlist,
  WatchlistView
} from '../../model/watchlist'
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
    const watchlistView = this.fromWatchlistToWatchlistView(watchlist)
    this._$watchlist.set(watchlistView)
  }

  @Input()
  public set tickerMessage(tickerMessage: TickerMessage | null) {
    if (!tickerMessage) {
      return
    }
    this.updateWatchlistWithMessage(tickerMessage)
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

  private fromWatchlistToWatchlistView(watchlist: Watchlist): WatchlistView {
    if (!watchlist.tickerSnapshots.length) {
      return { id: watchlist.id, name: watchlist.name, tickerSnapshotViews: [] }
    }

    const snapShotViews: TickerSnapshotView[] = watchlist.tickerSnapshots
      .sort((a, b) => (a.symbol > b.symbol ? 1 : -1))
      .map((snapShot) => {
        let barView: DailyBarView | null = null

        if (snapShot.day && snapShot.prevDay) {
          const dailyBar = snapShot.day?.tradingVolume > 0 ? snapShot.day : snapShot.prevDay
          barView = this.fromDailyBarToDailyBarView(dailyBar)
        }

        return {
          symbol: snapShot.symbol,
          name: snapShot.name,
          updated: snapShot.updated,
          dailyBarView: barView
        }
      })
    return { id: watchlist.id, name: watchlist.name, tickerSnapshotViews: snapShotViews }
  }

  private updateWatchlistWithMessage(tickerMessage: TickerMessage): void {
    const watchlistUpdated = this._$watchlist()
    const snapshotView = watchlistUpdated?.tickerSnapshotViews.find(
      (snapshot) => snapshot.symbol === tickerMessage.symbol
    )
    if (!snapshotView) {
      return
    }
    let updatedDailyBar: DailyBarView
    if (!snapshotView.dailyBarView) {
      updatedDailyBar = this.initDailyBarWithMessage(tickerMessage)
    } else {
      updatedDailyBar = this.buildDailyBarWithMessage(snapshotView.dailyBarView, tickerMessage)
    }
    snapshotView.dailyBarView = updatedDailyBar
    this._$watchlist.set(watchlistUpdated)
  }

  private initDailyBarWithMessage(tickerMessage: TickerMessage): DailyBarView {
    return {
      closePrice: { value: tickerMessage.closingTickPrice },
      tradingVolume: { value: tickerMessage.accumulatedVolume },
      volumeWeightedPrice: { value: tickerMessage.volumeWeightedPrice },
      openPrice: { value: 0 },
      highestPrice: { value: 0 },
      lowestPrice: { value: 0 }
    }
  }

  private buildDailyBarWithMessage(
    dailyBarView: DailyBarView,
    tickerMessage: TickerMessage
  ): DailyBarView {
    return {
      ...dailyBarView,
      closePrice: this.updatePriceChange(
        dailyBarView?.closePrice?.value,
        tickerMessage.closingTickPrice
      ),
      tradingVolume: this.updatePriceChange(
        dailyBarView?.tradingVolume?.value,
        tickerMessage.accumulatedVolume
      ),
      volumeWeightedPrice: this.updatePriceChange(
        dailyBarView?.volumeWeightedPrice?.value,
        tickerMessage.volumeWeightedPrice
      )
    }
  }

  private fromDailyBarToDailyBarView(dailyBar: DailyBar): DailyBarView {
    const barView: Partial<DailyBarView> = {}

    Object.keys(dailyBar).forEach((key) => {
      const barKey = key as keyof DailyBar
      barView[key as keyof DailyBarView] = this.initPriceChange(dailyBar[barKey])
    })
    return barView as DailyBarView
  }

  private initPriceChange(price: number): PriceChange {
    return { value: price }
  }

  private updatePriceChange(prevPrice: number, newPrice: number): PriceChange {
    let change: 'up' | 'down' | undefined
    if (prevPrice && newPrice > prevPrice) {
      change = 'up'
    }
    if (prevPrice && newPrice < prevPrice) {
      change = 'down'
    }
    return { value: newPrice, change }
  }
}
