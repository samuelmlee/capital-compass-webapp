import { TickersResult } from 'src/app/tickers/model/tickers-response'

export type WatchListResponse = { name: string; id: number; tickers: TickersResult[] }
