import { TestBed } from '@angular/core/testing'
import { EditWatchlistConfig } from '../model/edit-watchlist-config'
import { DailyBar, WatchlistView } from '../model/watchlist'
import { EditWatchlistService } from './edit-watchlist.service'
import { WatchlistService } from './watchlist.service'

describe('EditWatchlistService', () => {
  let service: EditWatchlistService
  let mockWatchlistService: Partial<WatchlistService>

  beforeEach(() => {
    mockWatchlistService = {
      updateWatchList: jest.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        EditWatchlistService,
        { provide: WatchlistService, useValue: mockWatchlistService }
      ]
    })

    service = TestBed.inject(EditWatchlistService)
  })

  it('should update the watchlist state correctly', () => {
    const watchlist: WatchlistView = {
      id: 1,
      name: 'My Watchlist',
      tickerSnapshotViews: [
        { name: 'Apple Inc.', symbol: 'AAPL', dailyBar: {} as DailyBar, updated: 123 },
        { name: 'Google LLC', symbol: 'GOOG', dailyBar: {} as DailyBar, updated: 123 }
      ]
    }

    service.updateStateWithWatchlist(watchlist)

    const updatedState = service.$watchlistState()

    expect(updatedState.id).toEqual(watchlist.id)
    expect(updatedState.name).toEqual(watchlist.name)
    expect(updatedState.tickersSelected).toContainEqual({ name: 'Apple Inc.', symbol: 'AAPL' })
    expect(updatedState.tickersSelected).toContainEqual({ name: 'Google LLC', symbol: 'GOOG' })
  })

  it('should call updateWatchList with the correct configuration when saving', () => {
    service['_$watchlistState'].update(() => ({
      id: 1,
      name: 'Updated Watchlist',
      tickersSelected: [
        { name: 'Tesla Inc.', symbol: 'TSLA' },
        { name: 'Amazon.com, Inc.', symbol: 'AMZN' }
      ]
    }))

    service.saveWatchList()

    const expectedConfig: EditWatchlistConfig = {
      id: 1,
      name: 'Updated Watchlist',
      tickerSymbols: new Set(['TSLA', 'AMZN'])
    }

    expect(mockWatchlistService.updateWatchList).toHaveBeenCalledWith(expectedConfig)
  })
})
