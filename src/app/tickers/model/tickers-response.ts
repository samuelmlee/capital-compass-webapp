export type TickersResult = {
  ticker: string
  name: string
  market: string
  currency_name: string
  primary_exchange: string | null
}

export type TickersResponse = {
  results: TickersResult[]
  cursor: string
}

export type TickersResponseWrapper = {
  value: TickersResponse
  error: unknown
}
