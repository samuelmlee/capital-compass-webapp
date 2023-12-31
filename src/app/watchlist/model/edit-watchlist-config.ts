export type WatchlistTicker = {
  name: string
  symbol: string
}

export type EditWatchlistState = {
  id?: number
  name: string
  tickersSelected: WatchlistTicker[]
}

export type CreateWatchlistConfig = {
  name: string
  tickerSymbols: Set<string>
}

export type EditWatchlistConfig = CreateWatchlistConfig & {
  id: number
}
