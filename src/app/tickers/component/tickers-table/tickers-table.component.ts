import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { BehaviorSubject, Observable, catchError } from 'rxjs'
import { TickersResponse, TickersResult } from '../../model/tickers-response'
import { TickersResultsCount } from '../../model/tickers-search-config'
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
  public columnDefs: ColumnDef[] = [
    { key: 'ticker', title: 'Ticker' },
    { key: 'name', title: 'Name' },
    { key: 'market', title: 'Market' },
    { key: 'currency_name', title: 'Currency Name' },
    { key: 'primary_exchange', title: 'Primary Exchange' }
  ]
  public rowDefs = this.columnDefs.map((c) => c.key)
  public pageSize = 50
  public tickersDataSource$: Observable<MatTableDataSource<TickersResult>>

  private dataSource: MatTableDataSource<TickersResult>
  public tickersDataSource: BehaviorSubject<MatTableDataSource<TickersResult>>
  private fetchSize: TickersResultsCount = 100
  private nextCursor = ''

  @ViewChild(MatPaginator) public paginator: MatPaginator | null = null

  public constructor(private tickerService: TickerService) {
    this.dataSource = new MatTableDataSource<TickersResult>([])
    this.tickersDataSource = new BehaviorSubject<MatTableDataSource<TickersResult>>(
      new MatTableDataSource<TickersResult>([])
    )
    this.tickersDataSource$ = this.tickersDataSource.asObservable()
  }

  public ngOnInit(): void {
    this.fetchData()
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  public onPageChange(event: PageEvent): void {
    if (event.pageIndex < this.dataSource.data.length / this.pageSize - 1) {
      return
    }
    this.fetchData(this.nextCursor)
  }

  private fetchData(cursor?: string): void {
    let dataObservable: Observable<TickersResponse>

    if (cursor) {
      dataObservable = this.tickerService.getTickersByCursor(cursor)
    } else {
      dataObservable = this.tickerService.getTickers({ resultsCount: this.fetchSize })
    }

    dataObservable
      .pipe(
        catchError((error) => {
          console.error('Error fetching tickers:', error)
          this.tickersDataSource.next(new MatTableDataSource<TickersResult>())
          throw error
        })
      )
      .subscribe((response) => {
        const newData = cursor ? [...this.dataSource.data, ...response.results] : [...response.results]
        this.dataSource.data = newData
        this.nextCursor = response.nextCursor
        this.tickersDataSource.next(this.dataSource)
      })
  }
}
