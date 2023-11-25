import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, computed } from '@angular/core'
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

import { TickersResponse, TickersResponseSource, TickersResult } from '../../model/tickers-response'
import { TickersSearchConfig } from '../../model/tickers-search-config'
import { TickersService } from '../../service/tickers.service'
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
  public tickersDataSource = computed(() => this.convertResponseToDataSource())

  private dataSource: MatTableDataSource<TickersResult>
  private nextCursor = ''

  @ViewChild(MatPaginator) public paginator: MatPaginator | null = null

  public constructor(private tickerService: TickersService) {
    this.dataSource = new MatTableDataSource<TickersResult>([])
  }

  public ngOnInit(): void {
    this.tickerService.fetchTickersByConfig(this.searchConfig)
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  public convertResponseToDataSource(): MatTableDataSource<TickersResult> {
    const error: unknown = this.tickerService.tickersSignal.error()
    if (error) {
      // show in toast
      return this.dataSource
    }
    const response = this.tickerService.tickersSignal.value()
    if (!response) {
      return this.dataSource
    }
    return this.updateDataSource(response)
  }

  private updateDataSource(response: TickersResponse): MatTableDataSource<TickersResult> {
    this.nextCursor = response.nextCursor
    this.dataSource.data =
      response.source == TickersResponseSource.CONFIG
        ? [...response.results]
        : [...this.dataSource.data, ...response.results]
    return this.dataSource
  }

  public onPageChange(event: PageEvent): void {
    if (event.pageIndex < this.dataSource.data.length / this.pageSize - 1) {
      return
    }
    this.tickerService.fetchTickersByCursor(this.nextCursor)
  }
}
