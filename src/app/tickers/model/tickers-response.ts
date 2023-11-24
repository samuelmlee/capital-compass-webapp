export type TickersResult = {
  ticker: string
  name: string
  market: string
  currency_name: string
  primary_exchange: string | null
}

export type TickersResponse = {
  results: TickersResult[]
  nextCursor: string
}

export type TickersResponseResult = {
  value: TickersResponse
  error: unknown
}
