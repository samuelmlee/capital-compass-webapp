import { HttpErrorResponse } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { Result } from '../model/result'
import { fromObsToSignal } from './from-obs-to-signal'

describe('fromObsToSignal', () => {
  it('should accept an Observable as input and return a Result', () => {
    TestBed.runInInjectionContext(() => {
      const obsResponse = of('Response')
      const processor = (e: HttpErrorResponse): string => {
        return 'Eror Processed'
      }

      const result: Result<string> = fromObsToSignal<string>(obsResponse, processor)

      expect(result).toBeDefined()
    })
  })
})
