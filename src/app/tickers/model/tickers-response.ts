export type TickersResult = {
  ticker: string
  name: string
  market: string
  currency_name: string
  primary_exchange: string | null
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

export type TickersResponseResult = {
  value: TickersResponse
  error: unknown
}
