export type TickersResultsCount = 50 | 100 | 150

export type TickersSearchConfig = {
  ticker?: string

  type?: string

  searchTerm?: string

  resultsCount?: TickersResultsCount
}
