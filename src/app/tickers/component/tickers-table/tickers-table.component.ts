import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { TickersResult } from '../../model/tickers-response'
import { TickerService } from '../../service/tickers.service'

type ColumnDef = { key: string; title: string }

@Component({
  selector: 'app-tickers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './tickers-table.component.html',
  styleUrl: './tickers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersTableComponent implements OnInit {
  public columnDefs: ColumnDef[] = [
    { key: 'ticker', title: 'Ticker' },
    { key: 'name', title: 'Name' },
    { key: 'market', title: 'Market' },
    { key: 'currency_name', title: 'Currency Name' },
    { key: 'primary_exchange', title: 'Primary Exchange' }
  ]

  public rowDefs = this.columnDefs.map((c) => c.key)

  public dataSource = signal<TickersResult[]>([])

  public constructor(private tickerService: TickerService) {}

  public ngOnInit(): void {
    this.tickerService.getTickers({ resultsCount: 50 }).subscribe((response) => {
      this.dataSource.set(response.results)
    })
  }
}
