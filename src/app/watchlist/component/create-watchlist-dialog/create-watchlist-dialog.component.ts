import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Subject } from 'rxjs'
import {
  TickersFilterComponent,
  TickersFilterConfig
} from 'src/app/tickers/component/tickers-filter/tickers-filter.component'
import {
  TickersTableComponent,
  TickersTableConfig
} from 'src/app/tickers/component/tickers-table/tickers-table.component'
import { TickersResult } from 'src/app/tickers/model/tickers-response'
import { TickersSearchConfig } from 'src/app/tickers/model/tickers-search-config'
import { CreateWatchListConfig } from '../../model/create-watchlist-config'

@Component({
  selector: 'app-create-watchlist-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TickersFilterComponent,
    TickersTableComponent
  ],
  templateUrl: './create-watchlist-dialog.component.html',
  styleUrl: './create-watchlist-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateWatchlistDialogComponent {
  private _tickersSelected = signal<Set<TickersResult>>(new Set())
  private _searchConfig = new Subject<TickersSearchConfig>()

  public tickersFilterConfig = signal<TickersFilterConfig>({ fields: ['searchTerm', 'type'] })
  public tickersTableConfig = signal<TickersTableConfig>({
    pageSize: 5,
    columnDefs: [
      { key: 'ticker', title: 'Ticker', class: ['w-25'] },
      { key: 'name', title: 'Name', class: ['w-50'] },
      { key: 'market', title: 'Market', class: [] },
      { key: 'primary_exchange', title: 'Primary Exchange', class: [] },
      {
        key: 'add',
        title: 'Action',
        class: [],
        isAction: true,
        actionCallback: (ticker): void => this.addTickerToWatchList(ticker as TickersResult),
        actionLabel: 'Add'
      }
    ]
  })
  public nameControl = new FormControl('', Validators.required)
  public searchConfig$ = this._searchConfig.asObservable()

  public constructor(private _dialogRef: MatDialogRef<CreateWatchlistDialogComponent>) {}

  public get tickersSelected(): Signal<Set<TickersResult>> {
    return this._tickersSelected.asReadonly()
  }

  public saveWatchList(): void {
    if (!this.nameControl.valid || !this.nameControl.value) {
      return
    }
    const config: CreateWatchListConfig = {
      name: this.nameControl.value,
      tickers: Array.from(this._tickersSelected()).map((ticker) => ticker.ticker)
    }
    this._dialogRef.close(config)
  }

  public updateSearchConfig(config: TickersSearchConfig): void {
    this._searchConfig.next(config)
  }

  public addTickerToWatchList(ticker: TickersResult): void {
    this._tickersSelected.update((selected) => selected.add(ticker))
  }

  public removeTickerFromWatchList(ticker: TickersResult): void {
    this._tickersSelected.update((selected) => {
      selected.delete(ticker)
      return selected
    })
  }
}
