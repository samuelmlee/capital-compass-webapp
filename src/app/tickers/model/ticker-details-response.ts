export type TickerDetailsResult = {
  ticker: string
  name: string
  market: string
  primaryExchange: string
  currencyName: string
  type: string
  description: string
  marketCap: number
  homePageUrl: string
  totalEmployees: number
  listDate: string
  shareClassSharesOutstanding: number
  weightedSharesOutstanding: number
}

export type TickerDetailsResponse = {
  result: TickerDetailsResult
}
