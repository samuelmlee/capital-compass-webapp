import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { TickersResult } from '../../model/tickers-response'
import { TickerService } from '../../service/tickers.service'

@Component({
  selector: 'app-tickers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './tickers-table.component.html',
  styleUrl: './tickers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersTableComponent implements OnInit {
  public displayedColumns: string[] = ['ticker']
  public dataSource = signal<TickersResult[]>([])

  public constructor(private tickerService: TickerService) {}

  public ngOnInit(): void {
    this.tickerService.getTickers({ resultsCount: 50 }).subscribe((response) => {
      this.dataSource.set(response.results)
    })
  }
}
