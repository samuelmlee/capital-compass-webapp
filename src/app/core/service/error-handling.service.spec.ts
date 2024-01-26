import { HttpErrorResponse } from '@angular/common/http'
import { ErrorHandlingService } from './error-handling.service'

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService

  beforeEach(() => {
    service = new ErrorHandlingService()
  })

  it('should return bad request error message for 400 status code', () => {
    const errorResponse = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' })

    const message = service.getErrorMessage(errorResponse, 'Resource')
    expect(message).toBe('Bad Request when accessing Resource.')
  })

  it('should return unauthorized error message for 401 status code', () => {
    const errorResponse = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })

    const message = service.getErrorMessage(errorResponse, 'Resource')
    expect(message).toBe('Unauthorized access to Resource. Please login.')
  })

  it('should return forbidden error message for 403 status code', () => {
    const errorResponse = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' })

    const message = service.getErrorMessage(errorResponse, 'Resource')
    expect(message).toBe('Forbidden access to Resource.')
  })

  it('should return not found error message for 404 status code', () => {
    const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' })

    const message = service.getErrorMessage(errorResponse, 'Resource')
    expect(message).toBe('Resource for User not found.')
  })

  it('should return server error message for 500 status code', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    })

    const message = service.getErrorMessage(errorResponse, 'Resource')
    expect(message).toBe('Server error occurred for Resource.')
  })

  it('should return a default error message for unknown status codes', () => {
    const errorResponse = new HttpErrorResponse({ status: 418, statusText: "I'm a teapot" })

    const message = service.getErrorMessage(errorResponse, 'Resource')
    expect(message).toBe('An unexpected error occurred.')
  })
})
