import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TickerMessage } from 'src/app/shared/model/ticker-message'
import { TickerWebsocketService } from 'src/app/shared/service/ticker-websocket.service'
import { PriceChangeBlinkDirective } from 'src/app/watchlist/directive/price-change-blink.directive'
import {
  DailyBar,
  DailyBarView,
  TickerSnapshot,
  TickerSnapshotView,
  ValueChange
} from 'src/app/watchlist/model/watchlist'

@Component({
  selector: 'app-watchlist-table-row',
  standalone: true,
  imports: [CommonModule, RouterModule, PriceChangeBlinkDirective],
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
  ): ValueChange {
    if (!dailyBarView) {
      return { value: 0, prevValue: 0, initialValue: 0 }
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
      barView[key as keyof DailyBarView] = this.initValueChange(dailyBar[barKey])
    })
    return barView as DailyBarView
  }

  private initValueChange(price: number): ValueChange {
    return { value: price, prevValue: price, initialValue: price }
  }

  private updateDailyBarWithMessage(
    dailyBarView: DailyBarView,
    tickerMessage: TickerMessage
  ): DailyBarView {
    return {
      ...dailyBarView,
      closePrice: {
        initialValue: dailyBarView.openPrice.initialValue,
        prevValue: dailyBarView.closePrice.value,
        value: tickerMessage.closingTickPrice
      },
      tradingVolume: {
        initialValue: dailyBarView.tradingVolume.initialValue,
        prevValue: dailyBarView.tradingVolume.value,
        value: tickerMessage.accumulatedVolume
      },
      volumeWeightedPrice: {
        initialValue: dailyBarView.openPrice.initialValue,
        prevValue: dailyBarView.volumeWeightedPrice.value,
        value: tickerMessage.volumeWeightedPrice
      }
    }
  }
}
