export type TickersResultsCount = 50 | 100 | 150

export type TickersSearchConfig = {
  cursor?: string

  tickerSymbol?: string

  searchTerm?: string

  resultsCount?: TickersResultsCount
}
