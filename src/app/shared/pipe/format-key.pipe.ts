import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatKey',
  standalone: true
})
export class FormatKeyPipe implements PipeTransform {
  public transform(key: string): string {
    key = key[0].toUpperCase() + key.slice(1)
    return key.split(/(?=[A-Z])/).join(' ')
  }
}
