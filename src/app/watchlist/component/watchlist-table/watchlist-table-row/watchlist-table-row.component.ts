import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal } from '@angular/core'
import { RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
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
export class WatchlistTableRowComponent implements OnInit, OnDestroy {
  @Input()
  public set tickerSnapshot(tickerSnapshot: TickerSnapshot) {
    const snapshotView = this.fromSnapshotToSnapshotView(tickerSnapshot)
    this._$tickerSnapshotView.set(snapshotView)
  }

  @Input()
  public set tableColumns(columns: string[]) {
    this._$tableColumns.set(columns)
  }

  private _$tickerSnapshotView = signal<TickerSnapshotView | null>(null)
  private _$tableColumns = signal<string[]>([])
  private _messageSubscription: Subscription | undefined

  public $tickerSnapshotView = this._$tickerSnapshotView.asReadonly()
  public $tableColumns = this._$tableColumns.asReadonly()

  constructor(private _tickerWebsocketService: TickerWebsocketService) {}

  public ngOnInit(): void {
    this._messageSubscription = this._tickerWebsocketService.tickerMessage$.subscribe((message) => {
      console.log('Message received in table row :', message)
      this.updateSnapshotWithMessage(message)
    })
  }

  public ngOnDestroy(): void {
    this._messageSubscription?.unsubscribe()
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

  public resolveDailyBarValue(dailyBarView: DailyBarView | null, key: string): PriceChange {
    if (!dailyBarView) {
      return { value: 0 }
    }
    return dailyBarView[key as keyof DailyBarView]
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

  private updateSnapshotWithMessage(tickerMessage: TickerMessage): void {
    const snapshotView = this._$tickerSnapshotView()
    if (!snapshotView || snapshotView.symbol !== tickerMessage.symbol) {
      return
    }
    let updatedDailyBar: DailyBarView
    if (!snapshotView.dailyBarView) {
      updatedDailyBar = this.initDailyBarWithMessage(tickerMessage)
    } else {
      updatedDailyBar = this.updateDailyBarWithMessage(snapshotView.dailyBarView, tickerMessage)
    }
    snapshotView.dailyBarView = updatedDailyBar
    this._$tickerSnapshotView.set({ ...snapshotView })
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
