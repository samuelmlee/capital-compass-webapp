export type DailyBar = {
  closePrice: number
  openPrice: number
  highestPrice: number
  lowestPrice: number
  tradingVolume: number
  volumeWeightedPrice: number
}

export type PriceChange = {
  value: number
  change?: 'up' | 'down'
}

export type DailyBarView = {
  closePrice: PriceChange
  openPrice: PriceChange
  highestPrice: PriceChange
  lowestPrice: PriceChange
  tradingVolume: PriceChange
  volumeWeightedPrice: PriceChange
}

export type TickerSnapshot = {
  updated: number
  symbol: string
  name: string
  day: DailyBar | undefined
  prevDay: DailyBar | undefined
}

export type Watchlist = {
  id: number
  name: string
  tickerSnapshots: TickerSnapshot[]
}

export type TickerSnapshotView = {
  updated: number
  symbol: string
  name: string
  dailyBarView: DailyBarView | null
}

export type WatchlistView = {
  name: string
  id: number
  tickerSnapshotViews: TickerSnapshotView[]
}

export type DeleteWatchlistView = {
  name: string
  id: number
}
