import { ChangeDetectionStrategy, Component, Signal, effect } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { NewsService } from '../../service/news.service'

@Component({
  selector: 'app-news-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './news-filter.component.html',
  styleUrl: './news-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsFilterComponent {
  public tickerSymbolControl = new FormControl('')
  public placeholder = 'Search for news that contain this ticker.'

  private _$tickerSymbol: Signal<string | null | undefined>

  constructor(private _newsService: NewsService) {
    effect(() => {
      const tickerSymbol = this._$tickerSymbol?.() ?? ''
      this._newsService.fetchNewsByTickerSymbol(tickerSymbol)
    })

    this._$tickerSymbol = toSignal(
      this.tickerSymbolControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
    )
  }

  public clearControl(): void {
    this.tickerSymbolControl.setValue('')
  }
}
