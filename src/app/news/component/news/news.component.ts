import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { NewsService } from '../../service/news.service'
import { NewsArticleComponent } from '../news-article/news-article.component'
import { NewsFilterComponent } from '../news-filter/news-filter.component'

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NewsArticleComponent, NewsFilterComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent implements OnInit {
  public $news = this._newsService.newsResult.value

  constructor(private _newsService: NewsService) {}

  public ngOnInit(): void {
    this._newsService.fetchNewsByTickerSymbol('')
  }
}
