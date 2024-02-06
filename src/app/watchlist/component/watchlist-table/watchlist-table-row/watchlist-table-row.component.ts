import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TickerMessage } from 'src/app/shared/model/ticker-message'
import { TickerWebsocketService } from 'src/app/shared/service/ticker-websocket.service'
import {
  DailyBar,
  DailyBarView,
  PriceChange,
  TickerSnapshot,
  TickerSnapshotView
} from 'src/app/watchlist/model/watchlist'

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
  public set tickerSnapshot(tickerSnapshot: TickerSnapshot) {
    const snapshotView = this.fromSnapshotToSnapshotView(tickerSnapshot)
    this._$tickerSnapshotPreUpdate.set(snapshotView)
  }

  @Input()
  public set tableColumns(columns: string[]) {
    this._$tableColumns.set(columns)
  }

  private _$tickerSnapshotPreUpdate = signal<TickerSnapshotView | null>(null)
  private _$tableColumns = signal<string[]>([])

  public $tableColumns = this._$tableColumns.asReadonly()

  public $tickerSnapshotView = computed(() => {
    const snapshotView = this._$tickerSnapshotPreUpdate()
    const tickerMessage = this._tickerWebsocketService.$tickerMessage()

    if (snapshotView?.symbol === tickerMessage?.symbol && snapshotView!.dailyBarView) {
      snapshotView!.dailyBarView = this.updateDailyBarWithMessage(
        snapshotView!.dailyBarView,
        tickerMessage!
      )
    }
    return { ...snapshotView }
  })

  constructor(private _tickerWebsocketService: TickerWebsocketService) {}

  public resolveDailyBarValue(
    dailyBarView: DailyBarView | null | undefined,
    key: string
  ): PriceChange {
    if (!dailyBarView) {
      return { value: 0 }
    }
    return dailyBarView[key as keyof DailyBarView]
  }

  private fromSnapshotToSnapshotView(snapshot: TickerSnapshot): TickerSnapshotView {
    let barView: DailyBarView | null = null

    if (snapshot.day && snapshot.prevDay) {
      const dailyBar = snapshot.day?.tradingVolume > 0 ? snapshot.day : snapshot.prevDay
      barView = this.fromDailyBarToDailyBarView(dailyBar)
    }

    return {
      symbol: snapshot.symbol,
      updated: snapshot.updated,
      name: snapshot.name,
      dailyBarView: barView
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

  private updateDailyBarWithMessage(
    dailyBarView: DailyBarView,
    tickerMessage: TickerMessage
  ): DailyBarView {
    return {
      ...dailyBarView,
      closePrice: this.updatePriceChange(
        dailyBarView?.openPrice?.value,
        tickerMessage.closingTickPrice
      ),
      tradingVolume: this.updatePriceChange(
        dailyBarView?.tradingVolume?.value,
        tickerMessage.accumulatedVolume
      ),
      volumeWeightedPrice: this.updatePriceChange(
        dailyBarView?.openPrice?.value,
        tickerMessage.volumeWeightedPrice
      )
    }
  }

  private updatePriceChange(prevValue: number, newValue: number): PriceChange {
    let change: 'up' | 'down' | undefined
    if (prevValue && newValue > prevValue) {
      change = 'up'
    }
    if (prevValue && newValue < prevValue) {
      change = 'down'
    }
    return { value: newValue, change }
  }
}
