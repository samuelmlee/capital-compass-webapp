import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, Signal, ViewChild, computed, signal } from '@angular/core'
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table'

import { TickersResponse, TickersResponseSource, TickersResult } from '../../model/tickers-response'
import { TickersSearchConfig } from '../../model/tickers-search-config'
import { TickersService } from '../../service/tickers.service'
import { NoTotalItemsPaginatorIntl } from './no-total-items-paginator-intl'

export type TickersTableConfig = { pageSize: number; columnDefs: ColumnDef[]; refreshTable?: Signal<boolean> }

type ColumnDef = {
  key: string
  title: string
  class: string[]
  isAction?: boolean
  actionCallback?: (element: unknown) => void
  actionLabel?: string
}

@Component({
  selector: 'app-tickers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: NoTotalItemsPaginatorIntl }],
  templateUrl: './tickers-table.component.html',
  styleUrl: './tickers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersTableComponent {
  @ViewChild('table') private _table: MatTable<TickersResult> | undefined

  @Input()
  public set searchConfig(config: TickersSearchConfig | null) {
    if (!config) {
      return
    }
    this._tickerService.fetchTickersByConfig(config)
  }

  @Input()
  public set tableConfig(config: TickersTableConfig) {
    this._tickersTableConfig.set(config)
  }

  private _tickersTableConfig = signal<TickersTableConfig>({
    pageSize: 50,
    columnDefs: [
      { key: 'ticker', title: 'Ticker', class: ['w-25'] },
      { key: 'name', title: 'Name', class: ['w-50'] },
      { key: 'market', title: 'Market', class: [] },
      { key: 'currency_name', title: 'Currency Name', class: [] },
      { key: 'primary_exchange', title: 'Primary Exchange', class: [] }
    ]
  })

  public rowDefs = computed(() => this._tickersTableConfig().columnDefs.map((c) => c.key))
  public tickersDataSource = computed(() => this.convertResponseToDataSource())

  private _dataSource: MatTableDataSource<TickersResult>
  private _nextCursor = ''

  @ViewChild(MatPaginator) public paginator: MatPaginator | null = null

  constructor(private _tickerService: TickersService) {
    this._dataSource = new MatTableDataSource<TickersResult>([])
  }

  public ngAfterViewInit(): void {
    this._dataSource.paginator = this.paginator
  }

  public get tickersTableConfig(): Signal<TickersTableConfig> {
    return this._tickersTableConfig.asReadonly()
  }

  public convertResponseToDataSource(): MatTableDataSource<TickersResult> {
    const error: unknown = this._tickerService.tickersSignal.error()
    if (error) {
      // show in toast
      return this._dataSource
    }
    const response = this._tickerService.tickersSignal.value()
    if (!response) {
      return this._dataSource
    }
    return this.updateDataSource(response)
  }

  public onPageChange(event: PageEvent): void {
    if (event.pageIndex < this._dataSource.data.length / this._tickersTableConfig().pageSize - 1) {
      return
    }
    this._tickerService.fetchTickersByCursor(this._nextCursor)
  }

  private updateDataSource(response: TickersResponse): MatTableDataSource<TickersResult> {
    this._nextCursor = response.nextCursor
    this._dataSource.data =
      response.source == TickersResponseSource.CONFIG
        ? [...response.results]
        : [...this._dataSource.data, ...response.results]
    return this._dataSource
  }
}
