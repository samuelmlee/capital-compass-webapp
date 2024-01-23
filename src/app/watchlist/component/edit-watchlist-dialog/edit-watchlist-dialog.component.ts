import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Signal,
  effect,
  signal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, distinctUntilChanged, map } from 'rxjs'
import { SnackbarService } from 'src/app/core/service/snack-bar.service'
import { WatchDialogData } from '../../model/watchlist-dialog-data'
import { BaseWatchlistService } from '../../service/base-watchlist.service'
import { CreateWatchlistService } from '../../service/create-watchlist.service'
import { EditWatchlistService } from '../../service/edit-watchlist.service'
import { WatchlistServicesModule } from '../../watchlist-services-module'
import { AddTickersTableComponent } from '../add-tickers-table/add-tickers-table.component'
import { TickerSelectedTableComponent } from '../ticker-selected-table/ticker-selected-table.component'

@Component({
  selector: 'app-edit-watchlist-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AddTickersTableComponent,
    TickerSelectedTableComponent,
    WatchlistServicesModule
  ],
  templateUrl: './edit-watchlist-dialog.component.html',
  styleUrl: './edit-watchlist-dialog.component.scss',
  providers: [
    {
      provide: BaseWatchlistService,
      useFactory: (injector: Injector, dialogData: WatchDialogData): BaseWatchlistService => {
        return dialogData
          ? injector.get(EditWatchlistService)
          : injector.get(CreateWatchlistService)
      },
      deps: [Injector, MAT_DIALOG_DATA]
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWatchlistDialogComponent {
  public nameControl: FormControl | undefined

  private _$watchlistName: Signal<string | undefined> | undefined
  private _$dialogTitle = signal<string>('Create Watchlist')
  public $dialogTitle = this._$dialogTitle.asReadonly()

  constructor(
    private _editWatchlistService: EditWatchlistService,
    private _dialogRef: MatDialogRef<EditWatchlistDialogComponent>,
    private _injector: Injector,
    private _snackBarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) private _dialogData: WatchDialogData
  ) {
    if (this._dialogData) {
      this._editWatchlistService.updateStateWithWatchlist(this._dialogData.watchlist)
      this._$dialogTitle.set('Edit Watchlist')
    }

    this.initFormControl()

    this.initWatchlistNameEffect()
  }

  public saveWatchList(): void {
    if (!this.nameControl?.valid) {
      return
    }
    this._editWatchlistService.saveWatchList()
    // TODO: wait for watchlist created signal value or error before closing
    this._dialogRef.close()
  }

  private initFormControl(): void {
    const name = this._editWatchlistService.$watchlistState().name
    this.nameControl = new FormControl(name, Validators.required)

    this._$watchlistName = toSignal(
      this.nameControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        map((value) => (value == null ? '' : value))
      )
    )
  }

  private initWatchlistNameEffect(): void {
    effect(
      () => {
        const watchlistName = this._$watchlistName?.()
        if (!watchlistName) {
          return
        }
        this._editWatchlistService.updateWatchlistName(watchlistName)
      },
      { allowSignalWrites: true }
    )
  }
}
