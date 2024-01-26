import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http'
import { of, throwError } from 'rxjs'
import { HttpRequestInterceptor } from './http-request-interceptor'
import { LoadingService } from './loading.service'

describe('HttpRequestInterceptor', () => {
  let interceptor: HttpRequestInterceptor
  let mockLoadingService: Partial<LoadingService>
  let nextHandler: HttpHandler

  beforeEach(() => {
    mockLoadingService = {
      setLoading: jest.fn()
    }

    interceptor = new HttpRequestInterceptor(mockLoadingService as LoadingService)

    nextHandler = {
      handle: jest.fn(() => of(new HttpResponse({ status: 200 })))
    }
  })

  it('should call setLoading on successful request', (done) => {
    const request = new HttpRequest('GET', '/test')

    interceptor.intercept(request, nextHandler).subscribe((event) => {
      if (event instanceof HttpResponse) {
        expect(mockLoadingService.setLoading).toHaveBeenCalledWith(true, '/test')
        expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false, '/test')
        done()
      }
    })
  })

  it('should call setLoading on failed request', (done) => {
    const request = new HttpRequest('GET', '/test')
    const errorResponse = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' })

    nextHandler.handle = jest.fn(() => throwError(() => errorResponse))

    interceptor.intercept(request, nextHandler).subscribe({
      next: () => {},
      error: (error) => {
        expect(error).toBe(errorResponse)
        expect(mockLoadingService.setLoading).toHaveBeenCalledWith(true, '/test')
        expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false, '/test')
        done()
      }
    })
  })
})
