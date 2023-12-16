export type DailyBar = {
  closePrice: number
  openPrice: number
  highestPrice: number
  lowestPrice: number
  tradingVolume: number
  volumeWeightedPrice: number
}

export type TickerSnapshot = {
  id: number
  updated: number
  symbol: string
  name: string
  day: DailyBar
  prevDay: DailyBar
}

export type Watchlist = {
  id: number
  name: string
  tickerSnapshots: TickerSnapshot[]
}

export type TickerSnapshotView = {
  id: number
  updated: number
  symbol: string
  name: string
  dailyBar: DailyBar
}

export type WatchlistView = {
  name: string
  id: number
  tickerSnapshotViews: TickerSnapshotView[]
}
