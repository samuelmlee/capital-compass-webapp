export type WatchlistTicker = {
  name: string
  symbol: string
}

export type EditWatchlistState = {
  name: string
  tickersSelected: Set<WatchlistTicker>
}

export type CreateWatchlistConfig = {
  name: string
  tickerSymbols: Set<WatchlistTicker>
}

export type EditWatchlistConfig = CreateWatchlistConfig & {
  id: number
}
