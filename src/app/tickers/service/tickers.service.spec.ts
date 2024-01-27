import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { TickerDetailsResponse, TickerDetailsResult } from '../model/ticker-details-response'
import { TickersTypesResponse } from '../model/ticker-types-response'
import { TickersResponse, TickersResponseSource, TickersResult } from '../model/tickers-response'
import { TickersService } from './tickers.service'

describe('TickersService', () => {
  let service: TickersService
  let httpTestingController: HttpTestingController

  const mockErrorHandlingService = {
    getErrorMessage: jest.fn().mockImplementation((error: HttpErrorResponse): string => {
      switch (error.status) {
        case 500:
          return `Server error occurred for Tickers.`
        default:
          return 'An unexpected error occurred.'
      }
    })
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TickersService,
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService }
      ]
    })

    service = TestBed.inject(TickersService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  it('should fetch tickers by config', () => {
    const mockTickersResult: TickersResult = {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      market: 'NASDAQ',
      currencyName: 'USD',
      primaryExchange: 'NASDAQ'
    }

    const mockResponse: TickersResponse = {
      results: [mockTickersResult],
      nextCursor: 'cursor',
      source: TickersResponseSource.CONFIG
    }
    const searchTerm = 'searchTerm'

    const mockConfig = { searchTerm: searchTerm, type: '', symbol: '' }
    service.fetchTickersByConfig(mockConfig)

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers?searchTerm=${searchTerm}`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)

    const response = service.tickersResult.value()
    expect(response).toEqual(mockResponse)
  })

  it('should handle error while fetching tickers by config', () => {
    service.fetchTickersByConfig({ type: '', searchTerm: '', symbol: '' })

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/stocks/reference/tickers`)
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error: unknown = service.tickersResult.error()
    expect(error).toEqual(`Server error occurred for Tickers.`)
  })

  it('should fetch tickers by cursor', () => {
    const mockTickersResult: TickersResult = {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      market: 'NASDAQ',
      currencyName: 'USD',
      primaryExchange: 'NASDAQ'
    }

    const mockResponse: TickersResponse = {
      results: [mockTickersResult],
      nextCursor: 'cursor2',
      source: TickersResponseSource.CURSOR
    }
    const cursor = 'cursor1'
    service.fetchTickersByCursor(cursor)

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/cursor/${cursor}`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)

    const response = service.tickersResult.value()
    expect(response).toEqual(mockResponse)
  })

  it('should handle error while fetching tickers by cursor', () => {
    const cursor = 'cursor'

    service.fetchTickersByCursor(cursor)

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/cursor/${cursor}`
    )
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error: unknown = service.tickersResult.error()
    expect(error).toEqual(`Server error occurred for Tickers.`)
  })

  it('should fetch ticker types', () => {
    const mockResponse: TickersTypesResponse = {
      results: [
        {
          code: 'CS',
          description: 'Common Stock'
        },
        {
          code: 'PFD',
          description: 'Preferred Stock'
        }
      ]
    }
    service.fetchTickerTypes()

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/types`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)

    const response = service.tickerTypesResult.value()
    expect(response).toEqual(mockResponse)
  })

  it('should handle error while fetching ticker types', () => {
    service.fetchTickerTypes()

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/types`
    )
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error: unknown = service.tickerTypesResult.error()
    expect(error).toEqual(`Server error occurred for Tickers.`)
  })

  it('should fetch ticker details', () => {
    const mockTickerDetails: TickerDetailsResult = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      market: 'NASDAQ',
      primaryExchange: 'NASDAQ',
      currencyName: 'USD',
      type: 'Technology',
      description:
        'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
      marketCap: 2000000000000,
      homePageUrl: 'https://www.apple.com',
      totalEmployees: 147000,
      listDate: '1980-12-12',
      shareClassSharesOutstanding: 17000000000,
      weightedSharesOutstanding: 16500000000
    }

    const mockResponse: TickerDetailsResponse = {
      result: mockTickerDetails
    }
    const tickerSymbol = 'AAPL'
    service.fetchTickerDetails(tickerSymbol)

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/details/${tickerSymbol}`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)

    const response = service.tickerDetailsResult.value()
    expect(response).toEqual(mockResponse)
  })

  it('should handle error while fetching ticker details', () => {
    const tickerSymbol = 'AAPL'
    service.fetchTickerDetails(tickerSymbol)

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/details/${tickerSymbol}`
    )
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error: unknown = service.tickerDetailsResult.error()
    expect(error).toEqual(`Server error occurred for Tickers.`)
  })
})
