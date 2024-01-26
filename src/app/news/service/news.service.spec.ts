import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { NewsResponse } from '../model/news-response'
import { NewsService } from './news.service'

describe('NewsService', () => {
  let service: NewsService
  let httpTestingController: HttpTestingController

  const mockErrorHandlingService = {
    getErrorMessage: jest.fn().mockImplementation((error: HttpErrorResponse): string => {
      switch (error.status) {
        case 500:
          return `Server error occurred for News.`
        default:
          return 'An unexpected error occurred.'
      }
    })
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NewsService,
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService }
      ]
    })

    service = TestBed.inject(NewsService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  it('should fetch the News By Ticker Symbol', () => {
    const mockNewsResponse: NewsResponse = {
      results: [
        {
          publisher: {
            name: 'News Publisher'
          },
          title: 'News Title',
          author: 'John Doe',
          publishedUtc: new Date('2022-01-01T12:00:00Z'),
          articleUrl: 'https://example.com/news-article',
          tickers: ['AAPL'],
          imageUrl: 'https://example.com/news-image.jpg',
          description: 'News description.',
          keywords: ['finance', 'technology']
        }
      ],
      nextCursor: 'next'
    }
    const tickerSymbol = 'AAPL'

    service.fetchNewsByTickerSymbol(tickerSymbol)
    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/news?ticker=${tickerSymbol}`
    )

    expect(req.request.method).toBe('GET')
    req.flush(mockNewsResponse)

    const newsResponse: NewsResponse | undefined = service.newsResult.value()
    expect(newsResponse).toEqual(newsResponse)
  })

  it('should fetch the News without Ticker Symbol', () => {
    const mockNewsResponse: NewsResponse = {
      results: [
        {
          publisher: {
            name: 'News Publisher'
          },
          title: 'News Title',
          author: 'John Doe',
          publishedUtc: new Date('2022-01-01T12:00:00Z'),
          articleUrl: 'https://example.com/news-article',
          tickers: ['GOOGL'],
          imageUrl: 'https://example.com/news-image.jpg',
          description: 'News description.',
          keywords: ['technology']
        }
      ],
      nextCursor: 'next'
    }

    service.fetchNewsByTickerSymbol('')
    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/news`
    )

    expect(req.request.method).toBe('GET')
    req.flush(mockNewsResponse)

    const newsResponse: NewsResponse | undefined = service.newsResult.value()
    expect(newsResponse).toEqual(newsResponse)
  })

  it('should emit an error while fetching the News returns an Error', () => {
    service.fetchNewsByTickerSymbol('')

    const req = httpTestingController.expectOne(
      `${service['_apiUrl']}/stocks/reference/tickers/news`
    )

    expect(req.request.method).toBe('GET')
    req.error(new ProgressEvent('Network Error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error: unknown = service.newsResult.error()
    expect(error).toEqual(`Server error occurred for News.`)
  })
})
