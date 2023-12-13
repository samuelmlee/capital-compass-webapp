export type DailyBar = {
  closePrice: number
  openPrice: number
  highestPrice: number
  lowestPrice: number
  tradingVolume: number
  volumeWeightedPrice: number
}

export type TickerSnapshot = {
  updated: number
  ticker: string
  day: DailyBar
  prevDay: DailyBar
}

export type Watchlist = {
  id: number
  name: string
  tickerSnapshots: TickerSnapshot[]
}

export type TickerSnapshotView = {
  updated: number
  ticker: string
  dailyBar: DailyBar
}

export type WatchlistView = {
  name: string
  id: number
  tickerSnapshotViews: TickerSnapshotView[]
}
