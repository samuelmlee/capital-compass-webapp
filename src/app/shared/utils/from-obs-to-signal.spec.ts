import { Signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { Result } from '../model/result'
import { fromObsToSignal } from './from-obs-to-signal'

describe('fromObsToSignal', () => {
  it('should accept an Observable as input and return a Result', () => {
    const obsResponse = of('Response')
    const processor = (): string => {
      return 'Error Processed'
    }

    const result: Result<string> = TestBed.runInInjectionContext(() =>
      fromObsToSignal<string>(obsResponse, processor)
    )

    const valueSignal: Signal<string | undefined> = result.value
    const errorSignal: Signal<unknown> = result.error

    expect(valueSignal()).toEqual('Response')
    expect(errorSignal()).toEqual(null)
  })
})
