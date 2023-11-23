import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, effect, signal } from '@angular/core'
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { TickersResponse, TickersResult } from '../../model/tickers-response'
import { TickersSearchConfig } from '../../model/tickers-search-config'
import { TickerService } from '../../service/tickers.service'
import { NoTotalItemsPaginatorIntl } from './no-total-items-paginator-intl'

type ColumnDef = { key: string; title: string }

@Component({
  selector: 'app-tickers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: NoTotalItemsPaginatorIntl }],
  templateUrl: './tickers-table.component.html',
  styleUrl: './tickers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersTableComponent implements OnInit {
  @Input() public searchConfig: TickersSearchConfig = {}

  public columnDefs: ColumnDef[] = [
    { key: 'ticker', title: 'Ticker' },
    { key: 'name', title: 'Name' },
    { key: 'market', title: 'Market' },
    { key: 'currency_name', title: 'Currency Name' },
    { key: 'primary_exchange', title: 'Primary Exchange' }
  ]
  public rowDefs = this.columnDefs.map((c) => c.key)
  public pageSize = 50
  public tickersDataSource

  private dataSource: MatTableDataSource<TickersResult>
  private nextCursor = ''
  private tickersResponseConfigSignal = this.tickerService.tickersResponseNewSignal
  private tickersResponseCursorSignal = this.tickerService.tickersResponseUpdateSignal

  @ViewChild(MatPaginator) public paginator: MatPaginator | null = null

  public constructor(private tickerService: TickerService) {
    this.dataSource = new MatTableDataSource<TickersResult>([])
    this.tickersDataSource = signal<MatTableDataSource<TickersResult>>(this.dataSource)

    effect(() => {
      this.updateDataSourceConfigResponse()
    })

    effect(() => {
      this.updateDataSourceCursorResponse()
    })
  }

  public ngOnInit(): void {
    this.tickerService.fetchDataWithConfig(this.searchConfig)
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  public onPageChange(event: PageEvent): void {
    if (event.pageIndex < this.dataSource.data.length / this.pageSize - 1) {
      return
    }
    this.tickerService.fetchDataWithCursor(this.nextCursor)
  }

  private updateDataSourceConfigResponse(): void {
    const response: TickersResponse = this.tickersResponseConfigSignal()
    const newData = [...response.results]
    this.updateDataSource(newData, response)
  }

  private updateDataSourceCursorResponse(): void {
    const response: TickersResponse = this.tickersResponseCursorSignal()
    const newData = [...this.dataSource.data, ...response.results]
    this.updateDataSource(newData, response)
  }

  private updateDataSource(newData: TickersResult[], response: TickersResponse): void {
    this.dataSource.data = newData
    this.nextCursor = response.cursor
    this.tickersDataSource.set(this.dataSource)
  }
}
