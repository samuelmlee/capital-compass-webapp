import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { RouterModule } from '@angular/router'
import { DailyBarView, PriceChange, TickerSnapshotView } from 'src/app/watchlist/model/watchlist'

@Component({
  selector: 'app-watchlist-table-row',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './watchlist-table-row.component.html',
  styleUrl: './watchlist-table-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistTableRowComponent {
  @Input()
  public set tickerSnapshotViews(tickerSnapshotViews: TickerSnapshotView[]) {
    this._$tickerSnapshotViews.set(tickerSnapshotViews)
  }

  @Input()
  public set tableColumns(columns: string[]) {
    this._$tableColumns.set(columns)
  }

  private _$tickerSnapshotViews = signal<TickerSnapshotView[]>([])
  private _$tableColumns = signal<string[]>([])

  public $tickerSnapshotViews = this._$tickerSnapshotViews.asReadonly()
  public $tableColumns = this._$tableColumns.asReadonly()

  public resolveDailyBarValue(dailyBarView: DailyBarView | null, key: string): PriceChange {
    if (!dailyBarView) {
      return { value: 0 }
    }
    return dailyBarView[key as keyof DailyBarView]
  }
}
