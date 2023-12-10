import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tickers-detail',
  standalone: true,
  imports: [],
  templateUrl: './tickers-detail.component.html',
  styleUrl: './tickers-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersDetailComponent implements OnInit {

  private tickerSymbol = ''

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.tickerSymbol = this.route.snapshot.paramMap.get('ticker') ?? ''

    console.log('ticker symbol :', this.tickerSymbol)
  }

}
