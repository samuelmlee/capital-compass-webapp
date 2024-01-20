import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  computed,
  signal
} from '@angular/core'
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

import { MatButtonModule } from '@angular/material/button'
import { RouterModule } from '@angular/router'
import { CastPipe } from 'src/app/shared/pipe/cast.pipe'
import { TickersResponse, TickersResponseSource, TickersResult } from '../../model/tickers-response'
import { TickersSearchConfig } from '../../model/tickers-search-config'
import {
  ActionColumnDef,
  COLUMN_TYPE,
  LinkColumnDef,
  TickersTableConfig
} from '../../model/tickers-table-config'
import { TickersService } from '../../service/tickers.service'
import { NoTotalItemsPaginatorIntl } from './no-total-items-paginator-intl'

@Component({
  selector: 'app-tickers-table',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    CastPipe
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: NoTotalItemsPaginatorIntl }],
  templateUrl: './tickers-table.component.html',
  styleUrl: './tickers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersTableComponent {
  @Input()
  public set searchConfig(config: TickersSearchConfig | null) {
    if (!config) {
      return
    }
    this._tickerService.fetchTickersByConfig(config)
  }

  @Input()
  public set tableConfig(config: TickersTableConfig) {
    this._$tickersTableConfig.set(config)
  }

  private _$tickersTableConfig = signal<TickersTableConfig>({
    pageSize: 50,
    columnDefs: [
      { key: 'symbol', title: 'Ticker', headerCellclass: ['w-25'], type: COLUMN_TYPE.TEXT },
      {
        key: 'name',
        title: 'Name',
        headerCellclass: ['w-25'],
        type: COLUMN_TYPE.LINK,
        routePath: '/ticker-details/',
        routeParam: 'symbol',
        cellClass: ['ellipsis']
      },
      { key: 'market', title: 'Market', headerCellclass: [], type: COLUMN_TYPE.TEXT },
      { key: 'currencyName', title: 'Currency Name', headerCellclass: [], type: COLUMN_TYPE.TEXT },
      {
        key: 'primaryExchange',
        title: 'Primary Exchange',
        headerCellclass: [],
        type: COLUMN_TYPE.TEXT
      }
    ]
  })

  public $rowDefs = computed(() => this._$tickersTableConfig().columnDefs.map((c) => c.key))
  public $tickersDataSource = computed(() => this.convertResponseToDataSource())
  public $tickersTableConfig = this._$tickersTableConfig.asReadonly()
  public ColumnType = COLUMN_TYPE
  public ActionColumnDef: ActionColumnDef | undefined
  public LinkColumnDef: LinkColumnDef | undefined

  private _dataSource: MatTableDataSource<TickersResult>
  private _nextCursor = ''

  @ViewChild(MatPaginator) public paginator: MatPaginator | null = null

  constructor(private _tickerService: TickersService) {
    this._dataSource = new MatTableDataSource<TickersResult>([])
  }

  public ngAfterViewInit(): void {
    this._dataSource.paginator = this.paginator
  }

  public convertResponseToDataSource(): MatTableDataSource<TickersResult> {
    const error: unknown = this._tickerService.tickersResult.error()
    if (error) {
      // show in toast
      return this._dataSource
    }
    const response = this._tickerService.tickersResult.value()
    if (!response) {
      return this._dataSource
    }
    if (response.source == TickersResponseSource.CONFIG) {
      this.paginator?.firstPage()
    }
    return this.updateDataSource(response)
  }

  public onPageChange(event: PageEvent): void {
    if (event.pageIndex < this._dataSource.data.length / this._$tickersTableConfig().pageSize - 1) {
      return
    }
    if (!this._nextCursor) {
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
