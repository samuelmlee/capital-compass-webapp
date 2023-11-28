import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
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
import { TickersSearchConfig } from 'src/app/tickers/model/tickers-search-config'

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
  public tickersFilterConfig: TickersFilterConfig = { fields: ['searchTerm', 'type'] }
  public tickersTableConfig: TickersTableConfig = { pageSize: 5 }
  public nameControl = new FormControl('')

  private _searchConfig = new Subject<TickersSearchConfig>()
  public searchConfig$ = this._searchConfig.asObservable()

  public constructor(private _dialogRef: MatDialogRef<CreateWatchlistDialogComponent>) {}

  public updateSearchConfig(config: TickersSearchConfig): void {
    this._searchConfig.next(config)
  }
}
