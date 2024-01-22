import { DecimalPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, Signal, computed } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ErrorMessageComponent } from 'src/app/shared/component/error-message/error-message.component'
import { FormatKeyPipe } from 'src/app/shared/pipe/format-key.pipe'
import { TickerDetailsResult } from '../../model/ticker-details-response'
import { TickersService } from '../../service/tickers.service'

type TickerDetailView = {
  key: string
  value: string | number
}

@Component({
  selector: 'app-tickers-detail',
  standalone: true,
  imports: [ErrorMessageComponent, DecimalPipe, FormatKeyPipe],
  templateUrl: './tickers-detail.component.html',
  styleUrl: './tickers-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersDetailComponent implements OnInit {
  public $tickerDetails = this._tickersService.tickerDetailsResult.value

  public $tickerDetailsError = this._tickersService.tickerDetailsResult.error

  public $primaryDetails: Signal<TickerDetailView[]> = computed(() => {
    const tickerDetails = this.$tickerDetails()
    return this.fromResponseToTickerDetailsView(tickerDetails?.result, this.primaryDetailsKeys)
  })

  public $secondaryDetails: Signal<TickerDetailView[]> = computed(() => {
    const tickerDetails = this.$tickerDetails()
    return this.fromResponseToTickerDetailsView(tickerDetails?.result, this.secondaryDetailsKeys)
  })

  private primaryDetailsKeys = ['market', 'primaryExchange', 'currencyName', 'type', 'description']
  private secondaryDetailsKeys = [
    'marketCap',
    'homePageUrl',
    'totalEmployees',
    'listDate',
    'shareClassSharesOutstanding',
    'weightedSharesOutstanding'
  ]

  constructor(
    private _route: ActivatedRoute,
    private _tickersService: TickersService
  ) {}

  public ngOnInit(): void {
    const tickerSymbol = this._route.snapshot.paramMap.get('ticker') ?? ''
    this._tickersService.fetchTickerDetails(tickerSymbol)
  }

  private fromResponseToTickerDetailsView(
    result: TickerDetailsResult | undefined,
    detailKeys: string[]
  ): TickerDetailView[] {
    if (!result) {
      return [{ key: 'Error', value: 'Error fetching details for ticker' }]
    }
    const tickerDetailViews: TickerDetailView[] = []
    Object.keys(result).forEach((key) => {
      const value = result[key as keyof TickerDetailsResult]

      if (detailKeys.includes(key)) {
        tickerDetailViews.push({ key, value })
      }
    })
    return tickerDetailViews
  }
}
