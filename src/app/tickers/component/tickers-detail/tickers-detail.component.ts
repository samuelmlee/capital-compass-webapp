import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TickersService } from '../../service/tickers.service'

@Component({
  selector: 'app-tickers-detail',
  standalone: true,
  imports: [],
  templateUrl: './tickers-detail.component.html',
  styleUrl: './tickers-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersDetailComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _tickersService: TickersService
  ) {}

  public ngOnInit(): void {
    const tickerSymbol = this._route.snapshot.paramMap.get('ticker') ?? ''

    this._tickersService.fetchTickerDetails(tickerSymbol)

    console.log('ticker symbol :', tickerSymbol)
  }
}
