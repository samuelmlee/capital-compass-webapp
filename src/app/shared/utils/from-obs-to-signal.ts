import { HttpErrorResponse } from '@angular/common/http'
import { computed } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Observable, catchError, map, of } from 'rxjs'
import { Result } from '../model/result'

export function fromObsToSignal<T>(
  obs$: Observable<T>,
  errorProcessor: (e: HttpErrorResponse) => unknown
): Result<T> {
  const source = toSignal(
    obs$.pipe(
      map((value) => ({ value, error: null })),
      catchError((err: HttpErrorResponse) => {
        const processed = errorProcessor(err)
        return of({ value: undefined, error: processed })
      })
    )
  )

  const value = computed(() => source()?.value)
  const error = computed(() => source()?.error)

  return { value, error }
}
