import { Injectable } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import { WatchlistTicker } from '../model/edit-watchlist-config'
import { BaseWatchlistService } from './base-watchlist.service'
import { WatchlistService } from './watchlist.service'

@Injectable()
class TestBaseWatchlistService extends BaseWatchlistService {
  public saveWatchList(): void {}
}

describe('BaseWatchlistService', () => {
  let service: TestBaseWatchlistService
  let mockWatchlistService: Partial<WatchlistService>

  beforeEach(() => {
    mockWatchlistService = {}

    TestBed.configureTestingModule({
      providers: [
        TestBaseWatchlistService,
        { provide: WatchlistService, useValue: mockWatchlistService }
      ]
    })

    service = TestBed.inject(TestBaseWatchlistService)
  })

  it('should add a ticker to the watchlist', () => {
    const mockTicker: TickersResult = {
      name: 'Apple Inc.',
      market: 'stocks',
      symbol: 'AAPL',
      currencyName: 'usd',
      primaryExchange: 'XNAS'
    }
    service.addTickerResultToWatchList(mockTicker)

    const currentState = service.$watchlistState()
    expect(currentState.tickersSelected).toContainEqual({ name: 'Apple Inc.', symbol: 'AAPL' })
  })

  it('should remove a ticker from the watchlist', () => {
    const mockTickerToAdd: TickersResult = {
      name: 'Apple Inc.',
      market: 'stocks',
      symbol: 'AAPL',
      currencyName: 'usd',
      primaryExchange: 'XNAS'
    }
    const mockTickerToRemove: WatchlistTicker = { symbol: 'AAPL', name: 'Apple' }
    service.addTickerResultToWatchList(mockTickerToAdd)
    service.removeTickerFromWatchList(mockTickerToRemove)

    const currentState = service.$watchlistState()
    expect(currentState.tickersSelected).not.toContainEqual({ name: 'Apple', symbol: 'AAPL' })
  })

  it('should update the watchlist name', () => {
    const newName = 'New Watchlist'
    service.updateWatchlistName(newName)

    const currentState = service.$watchlistState()
    expect(currentState.name).toEqual(newName)
  })
})
