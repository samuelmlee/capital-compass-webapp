import { TickersResult } from 'src/app/tickers/model/tickers-response'

export type WatchlistResponse = { name: string; id: number; tickers: TickersResult[] }
