import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { NewsResult } from '../../model/news-response'

@Component({
  selector: 'app-news-article',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './news-article.component.html',
  styleUrl: './news-article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsArticleComponent {
  @Input()
  public set result(result: NewsResult) {
    this._$newsResult.set(result)
  }

  private _$newsResult = signal<NewsResult | null>(null)

  public $newsResult = this._$newsResult.asReadonly()
}
