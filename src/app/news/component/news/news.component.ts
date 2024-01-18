import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { NewsService } from '../../service/news.service'
import { NewsArticleComponent } from '../news-article/news-article.component'

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NewsArticleComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent implements OnInit {
  public newsSignal = this._newsService.newsSignal

  constructor(private _newsService: NewsService) {}

  public ngOnInit(): void {
    this._newsService.fetchTickersByConfig()
  }
}
