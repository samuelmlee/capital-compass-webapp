import { HttpErrorResponse } from '@angular/common/http'
import { Signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { Result } from '../model/result'
import { fromObsToSignal } from './from-obs-to-signal'

describe('fromObsToSignal', () => {
  it('should handle a Success Response of an Observable and return a Result', () => {
    const obsResponse = of('Success Response')
    const processor = (): string => {
      return 'Error Processed'
    }

    const result: Result<string> = TestBed.runInInjectionContext(() =>
      fromObsToSignal<string>(obsResponse, processor)
    )

    const valueSignal: Signal<string | undefined> = result.value
    const errorSignal: Signal<unknown> = result.error

    expect(valueSignal()).toEqual('Success Response')
    expect(errorSignal()).toEqual(null)
  })

  it('should handle Error from Observable and process it', () => {
    const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' })
    const obsError = throwError(() => errorResponse)
    const processor = jest.fn().mockReturnValue('Not Found')

    const result: Result<string> = TestBed.runInInjectionContext(() =>
      fromObsToSignal<string>(obsError, processor)
    )

    expect(processor).toHaveBeenCalledWith(errorResponse)
    expect(result.value()).toBeUndefined()
    expect(result.error()).toEqual('Not Found')
  })

  it('should handle different return types from error processor', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    })
    const obsError = throwError(() => errorResponse)
    const processor = jest.fn().mockReturnValue({ errorMessage: 'Processed Error', code: 500 })

    const result: Result<string> = TestBed.runInInjectionContext(() =>
      fromObsToSignal<string>(obsError, processor)
    )

    expect(processor).toHaveBeenCalledWith(errorResponse)
    expect(result.error()).toEqual({ errorMessage: 'Processed Error', code: 500 })
  })
})
