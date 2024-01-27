import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { LoadingService } from '../../core/service/loading.service'
import { Watchlist } from '../model/watchlist'
import { WatchlistService } from './watchlist.service'

describe('WatchlistService', () => {
  let service: WatchlistService
  let httpTestingController: HttpTestingController
  let mockErrorHandlingService: Partial<ErrorHandlingService>
  let mockLoadingService: Partial<LoadingService>

  beforeEach(() => {
    mockErrorHandlingService = {
      getErrorMessage: jest.fn().mockImplementation((error: HttpErrorResponse): string => {
        switch (error.status) {
          case 500:
            return `Server error occurred for Watchlists.`
          default:
            return 'An unexpected error occurred.'
        }
      })
    }

    mockLoadingService = {
      setLoading: jest.fn(),
      isLoading: jest.fn()
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WatchlistService,
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService },
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    })

    service = TestBed.inject(WatchlistService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should fetch user watchlists', () => {
    const mockWatchlists: Watchlist[] = [
      {
        id: 1,
        name: 'Test Watchlist 1',
        tickerSnapshots: []
      },
      {
        id: 2,
        name: 'Test Watchlist 2.12',
        tickerSnapshots: [
          {
            updated: 1706317080000000000,
            symbol: 'AA',
            name: 'Alcoa Corporation',
            day: {
              closePrice: 30,
              openPrice: 30,
              highestPrice: 30,
              lowestPrice: 29,
              tradingVolume: 5123914,
              volumeWeightedPrice: 30
            },
            prevDay: {
              closePrice: 29,
              openPrice: 29,
              highestPrice: 30,
              lowestPrice: 29,
              tradingVolume: 4683347,
              volumeWeightedPrice: 29
            }
          }
        ]
      }
    ]

    service.fetchWatchLists()

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/gateway/watchlists`)
    expect(req.request.method).toEqual('GET')
    req.flush(mockWatchlists)

    const response = service.watchlistsResult.value()
    expect(response).toEqual(mockWatchlists)
  })

  it('should handle error on fetching watchlists', () => {
    service.fetchWatchLists()

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/gateway/watchlists`)
    expect(req.request.method).toEqual('GET')
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error = service.watchlistsResult.error()
    expect(error).toEqual(`Server error occurred for Watchlists.`)
  })

  it('should create a new watchlist', () => {
    const mockCreateConfig = { name: 'New Watchlist', tickerSymbols: new Set(['AAPL', 'GOOG']) }
    const mockResponse = { id: 1, name: 'New Watchlist', tickers: ['AAPL', 'GOOG'] }

    service.createWatchList(mockCreateConfig)

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/users/watchlists`)
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual({
      ...mockCreateConfig,
      tickerSymbols: [...mockCreateConfig.tickerSymbols]
    })
    req.flush(mockResponse)

    const response = service.watchlistCreatedResult.value()
    expect(response).toEqual(mockResponse)
  })

  it('should handle error on creating watchlist', () => {
    const mockCreateConfig = { name: 'New Watchlist', tickerSymbols: new Set(['AAPL', 'GOOG']) }

    service.createWatchList(mockCreateConfig)

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/users/watchlists`)
    expect(req.request.method).toEqual('POST')
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error = service.watchlistCreatedResult.error()
    expect(error).toEqual(`Server error occurred for Watchlists.`)
  })

  it('should update an existing watchlist', () => {
    const mockEditConfig = {
      id: 1,
      name: 'Updated Watchlist',
      tickerSymbols: new Set(['MSFT', 'TSLA'])
    }
    const mockResponse = { id: 1, name: 'Updated Watchlist', tickers: ['MSFT', 'TSLA'] }

    service.updateWatchList(mockEditConfig)

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/users/watchlists`)
    expect(req.request.method).toEqual('PUT')
    expect(req.request.body).toEqual({
      ...mockEditConfig,
      tickerSymbols: [...mockEditConfig.tickerSymbols]
    })
    req.flush(mockResponse)

    const response = service.watchlistUpdatedResult.value()
    expect(response).toEqual(mockResponse)
  })

  it('should handle error on updating watchlist', () => {
    const mockEditConfig = {
      id: 1,
      name: 'Updated Watchlist',
      tickerSymbols: new Set(['MSFT', 'TSLA'])
    }
    service.updateWatchList(mockEditConfig)

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/users/watchlists`)
    expect(req.request.method).toEqual('PUT')
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error = service.watchlistUpdatedResult.error()
    expect(error).toEqual(`Server error occurred for Watchlists.`)
  })

  it('should delete a watchlist', () => {
    const watchlistIdToDelete = 1

    service.deleteWatchlist(watchlistIdToDelete)

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/users/watchlists/${watchlistIdToDelete}`
    )
    expect(req.request.method).toEqual('DELETE')
    req.flush(null)

    const response = service.watchlistDeletedResult.value()
    expect(response).toEqual(watchlistIdToDelete)
  })

  it('should handle error on deleting watchlist', () => {
    const watchlistIdToDelete = 1

    service.deleteWatchlist(watchlistIdToDelete)

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/users/watchlists/${watchlistIdToDelete}`
    )
    expect(req.request.method).toEqual('DELETE')
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error = service.watchlistDeletedResult.error()
    expect(error).toEqual(`Server error occurred for Watchlists.`)
  })
})
