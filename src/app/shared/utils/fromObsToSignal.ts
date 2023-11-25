import { Signal, computed } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Observable, catchError, map, of } from 'rxjs'

export function fromObsToSignal<T>(obs$: Observable<T>): { value: Signal<T | undefined>; error: Signal<unknown> } {
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
