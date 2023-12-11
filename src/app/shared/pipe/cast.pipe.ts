import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'cast',
  standalone: true
})
export class CastPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transform<T>(value: unknown, _type: (new (...args: unknown[]) => T) | T): T {
    return value as T
  }
}
