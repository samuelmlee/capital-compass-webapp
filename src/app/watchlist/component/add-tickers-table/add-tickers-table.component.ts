import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Subject } from 'rxjs'
import {
  TickersFilterComponent,
  TickersFilterConfig
} from 'src/app/tickers/component/tickers-filter/tickers-filter.component'
import { TickersTableComponent } from 'src/app/tickers/component/tickers-table/tickers-table.component'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import { TickersSearchConfig } from 'src/app/tickers/model/tickers-search-config'
import { COLUMN_TYPE, TickersTableConfig } from 'src/app/tickers/model/tickers-table-config'
import { EditWatchlistService } from '../../service/edit-watchlist.service'

@Component({
  selector: 'app-add-tickers-table',
  standalone: true,
  imports: [CommonModule, TickersFilterComponent, TickersTableComponent],
  templateUrl: './add-tickers-table.component.html',
  styleUrl: './add-tickers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTickersTableComponent {
  public $tickersFilterConfig = signal<TickersFilterConfig>({ fields: ['searchTerm', 'type'] })

  public $tickersTableConfig = signal<TickersTableConfig>({
    pageSize: 5,
    columnDefs: [
      { key: 'symbol', title: 'Ticker', headerCellclass: ['w-25'], type: COLUMN_TYPE.TEXT },
      {
        key: 'name',
        title: 'Name',
        headerCellclass: ['w-50'],
        type: COLUMN_TYPE.TEXT,
        cellClass: ['ellipsis']
      },
      { key: 'market', title: 'Market', headerCellclass: [], type: COLUMN_TYPE.TEXT },
      {
        key: 'primary_exchange',
        title: 'Primary Exchange',
        headerCellclass: [],
        type: COLUMN_TYPE.TEXT
      },
      {
        key: 'add',
        title: 'Action',
        headerCellclass: [],
        type: COLUMN_TYPE.ACTION,
        actionCallback: (ticker): void =>
          this._editWatchlistService.addTickerResultToWatchList(ticker as TickersResult),
        actionLabel: 'Add'
      }
    ]
  })

  private _searchConfig = new Subject<TickersSearchConfig>()
  public searchConfig$ = this._searchConfig.asObservable()

  constructor(private _editWatchlistService: EditWatchlistService) {}

  public updateSearchConfig(config: TickersSearchConfig): void {
    this._searchConfig.next(config)
  }
}
