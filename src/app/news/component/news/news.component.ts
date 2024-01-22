import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ErrorMessageComponent } from 'src/app/shared/component/error-message/error-message.component'
import { NewsService } from '../../service/news.service'
import { NewsArticleComponent } from '../news-article/news-article.component'
import { NewsFilterComponent } from '../news-filter/news-filter.component'

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [ErrorMessageComponent, NewsArticleComponent, NewsFilterComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent implements OnInit {
  public $news = this._newsService.newsResult.value

  public $newsError = this._newsService.newsResult.error

  constructor(private _newsService: NewsService) {}

  public ngOnInit(): void {
    this._newsService.fetchNewsByTickerSymbol('')
  }
}
