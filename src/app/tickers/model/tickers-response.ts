export type TickersResult = {
  symbol: string
  name: string
  market: string
  currencyName: string
  primaryExchange: string | null
}

export enum TickersResponseSource {
  CONFIG,
  CURSOR
}

export type TickersResponse = {
  results: TickersResult[]
  nextCursor: string
  source: TickersResponseSource | null
}
