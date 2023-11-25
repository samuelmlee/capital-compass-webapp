import { Signal } from '@angular/core'

export type Result<T> = { value: Signal<T | undefined>; error: Signal<unknown> }
