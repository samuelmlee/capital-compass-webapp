import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { TickersResult } from '../../model/tickers-response'
import { TickerService } from '../../service/tickers.service'

type ColumnDef = { key: string; title: string }

@Component({
  selector: 'app-tickers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
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

  public dataSource = new MatTableDataSource<TickersResult>([])
  public totalCount = 0
  public pageIndex = 0
  public pageSize = 0

  public constructor(private tickerService: TickerService) {}

  @ViewChild(MatPaginator) public paginator: MatPaginator | null = null

  public ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator
    }
  }

  public ngOnInit(): void {
    this.tickerService.getTickers({ resultsCount: 100 }).subscribe((response) => {
      this.dataSource.data = [...response.results]
    })
  }

  public onPageChange(event: PageEvent) {
    console.log(event)
  }
}
