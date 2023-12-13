import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { DailyBar, TickerSnapshotView, Watchlist, WatchlistView } from '../../model/watchlist'
import { FormatKeyPipe } from 'src/app/shared/pipe/format-key.pipe'

@Component({
  selector: 'app-watchlist-table',
  standalone: true,
  imports: [FormatKeyPipe],
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

  public tableColumns: string[] = ['closePrice', 'openPrice', 'highestPrice', 'lowestPrice', 'volumeWeightedPrice']

  private _watchlist = signal<WatchlistView | null>(null)
  public watchlistSignal = this._watchlist.asReadonly()

  public resolveDailyBarValue(dailyBar: DailyBar, key: string): string | number {
    return dailyBar[key as keyof DailyBar]
  }

  private fromWatchlistToWatchlistView(watchlist: Watchlist): WatchlistView {
    const snapShotViews: TickerSnapshotView[] = watchlist.tickerSnapshots.map((snapShot) => {
      return {
        ticker: snapShot.ticker,
        updated: snapShot.updated,
        dailyBar: snapShot.day.tradingVolume > 0 ? snapShot.day : snapShot.prevDay
      }
    })
    return { id: watchlist.id, name: watchlist.name, tickerSnapshotViews: snapShotViews }
  }
}
