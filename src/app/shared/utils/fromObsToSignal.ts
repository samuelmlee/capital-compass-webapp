import { computed } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Observable, catchError, map, of } from 'rxjs'
import { Result } from '../model/result'

export function fromObsToSignal<T>(obs$: Observable<T>): Result<T> {
  const source = toSignal(
    obs$.pipe(
      map((value) => ({ value, error: null })),
      catchError((err) => of({ value: undefined, error: err }))
    )
  )

  const value = computed(() => source()?.value)
  const error = computed(() => source()?.error)

  return { value, error }
}
