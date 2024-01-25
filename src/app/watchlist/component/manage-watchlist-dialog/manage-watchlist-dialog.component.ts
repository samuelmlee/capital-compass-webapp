import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject, Signal, effect, signal } from '@angular/core'
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
import { WatchlistService } from '../../service/watchlist.service'
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
    TickerSelectedTableComponent
  ],
  templateUrl: './manage-watchlist-dialog.component.html',
  styleUrl: './manage-watchlist-dialog.component.scss',
  providers: [
    {
      provide: BaseWatchlistService,
      useFactory: (
        dialogData: WatchDialogData,
        watchlistService: WatchlistService
      ): BaseWatchlistService => {
        return dialogData
          ? new EditWatchlistService(watchlistService)
          : new CreateWatchlistService(watchlistService)
      },
      deps: [MAT_DIALOG_DATA, WatchlistService]
    },
    WatchlistService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageWatchlistDialogComponent {
  public nameControl: FormControl | undefined

  private _$watchlistName: Signal<string | undefined> | undefined
  private _$dialogTitle = signal<string>('Create Watchlist')
  public $dialogTitle = this._$dialogTitle.asReadonly()

  constructor(
    private _baseWatchlistService: BaseWatchlistService,
    private _dialogRef: MatDialogRef<ManageWatchlistDialogComponent>,
    private _snackBarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) private _dialogData: WatchDialogData
  ) {
    if (this._dialogData) {
      const service = this._baseWatchlistService as EditWatchlistService
      service.updateStateWithWatchlist(this._dialogData.watchlist)

      this._$dialogTitle.set('Edit Watchlist')
    }

    this.initFormControl()

    this.initWatchlistNameEffect()

    this.initWatchlistResultEffect()
  }

  public saveWatchList(): void {
    if (!this.nameControl?.valid) {
      return
    }
    this._baseWatchlistService.saveWatchList()
  }

  private initFormControl(): void {
    const name = this._baseWatchlistService.$watchlistState().name
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
        this._baseWatchlistService.updateWatchlistName(watchlistName)
      },
      { allowSignalWrites: true }
    )
  }

  private initWatchlistResultEffect(): void {
    effect(() => {
      const errorMessage = this._baseWatchlistService.watchlistResult?.error()
      const watchlist = this._baseWatchlistService.watchlistResult?.value()
      if (!errorMessage && !watchlist) {
        return
      }
      if (errorMessage) {
        this._snackBarService.error(errorMessage as string)
        return
      }
      this._snackBarService.success('Watchlist has been updated')
      this._dialogRef.close()
    })
  }
}
