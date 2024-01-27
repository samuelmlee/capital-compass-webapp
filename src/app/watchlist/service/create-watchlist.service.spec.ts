import { TestBed } from '@angular/core/testing'
import { CreateWatchlistService } from './create-watchlist.service'
import { WatchlistService } from './watchlist.service'

describe('CreateWatchlistService', () => {
  let service: CreateWatchlistService
  let mockWatchlistService: Partial<WatchlistService>

  beforeEach(() => {
    mockWatchlistService = {
      createWatchList: jest.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        CreateWatchlistService,
        { provide: WatchlistService, useValue: mockWatchlistService }
      ]
    })

    service = TestBed.inject(CreateWatchlistService)
  })

  it('should call createWatchList with the correct configuration', () => {
    service['_$watchlistState'].update(() => ({
      name: 'Test Watchlist',
      tickersSelected: [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'GOOG', name: 'Google LLC' }
      ]
    }))

    service.saveWatchList()

    const expectedConfig = {
      name: 'Test Watchlist',
      tickerSymbols: new Set(['AAPL', 'GOOG'])
    }

    expect(mockWatchlistService.createWatchList).toHaveBeenCalledWith(expectedConfig)
  })
})
