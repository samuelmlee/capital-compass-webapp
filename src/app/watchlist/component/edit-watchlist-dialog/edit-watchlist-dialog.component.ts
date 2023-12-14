import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Signal, effect, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs'
import {
  TickersFilterComponent,
  TickersFilterConfig
} from 'src/app/tickers/component/tickers-filter/tickers-filter.component'
import { TickersTableComponent } from 'src/app/tickers/component/tickers-table/tickers-table.component'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import { TickersSearchConfig } from 'src/app/tickers/model/tickers-search-config'
import { COLUMN_TYPE, TickersTableConfig } from 'src/app/tickers/model/tickers-table-config'
import { EditWatchlistService } from '../../service/edit-watchlist.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { TickerSelectedTableComponent } from '../ticker-selected-table/ticker-selected-table.component'

@Component({
  selector: 'app-edit-watchlist-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TickersFilterComponent,
    TickersTableComponent,
    TickerSelectedTableComponent
  ],
  templateUrl: './edit-watchlist-dialog.component.html',
  styleUrl: './edit-watchlist-dialog.component.scss',
  providers: [EditWatchlistService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWatchlistDialogComponent {
  private _searchConfig = new Subject<TickersSearchConfig>()
  private _watchlistName: Signal<string | undefined>

  public tickersFilterConfig = signal<TickersFilterConfig>({ fields: ['searchTerm', 'type'] })
  public tickersTableConfig = signal<TickersTableConfig>({
    pageSize: 5,
    columnDefs: [
      { key: 'ticker', title: 'Ticker', class: ['w-25'], type: COLUMN_TYPE.TEXT },
      { key: 'name', title: 'Name', class: ['w-50'], type: COLUMN_TYPE.TEXT },
      { key: 'market', title: 'Market', class: [], type: COLUMN_TYPE.TEXT },
      { key: 'primary_exchange', title: 'Primary Exchange', class: [], type: COLUMN_TYPE.TEXT },
      {
        key: 'add',
        title: 'Action',
        class: [],
        type: COLUMN_TYPE.ACTION,
        actionCallback: (ticker): void =>
          this._watchlistTickersService.addTickerToWatchList(ticker as TickersResult),
        actionLabel: 'Add'
      }
    ]
  })
  public nameControl = new FormControl('', Validators.required)
  public searchConfig$ = this._searchConfig.asObservable()

  constructor(
    private _watchlistTickersService: EditWatchlistService,
    private _dialogRef: MatDialogRef<EditWatchlistDialogComponent>
  ) {
    this._watchlistName = toSignal(
      this.nameControl.valueChanges.pipe(
        debounceTime(500),
        startWith(''),
        distinctUntilChanged(),
        map((value) => (value === null ? '' : value))
      )
    )

    effect(() => {
      const watchlistName = this._watchlistName()
      if (!watchlistName) {
        return
      }
      this._watchlistTickersService.updateWatchlistName(watchlistName)
    })
  }

  public saveWatchList(): void {
    this._watchlistTickersService.saveWatchList()
    // wait for watchlist created signal value or error before closing
    this._dialogRef.close()
  }

  public updateSearchConfig(config: TickersSearchConfig): void {
    this._searchConfig.next(config)
  }
}
