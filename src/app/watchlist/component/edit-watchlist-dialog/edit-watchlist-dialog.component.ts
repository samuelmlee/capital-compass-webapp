import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject, Signal, effect } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { distinctUntilChanged, map } from 'rxjs'
import { WatchlistView } from '../../model/watchlist'
import { EditWatchlistService } from '../../service/edit-watchlist.service'
import { AddTickersTableComponent } from '../add-tickers-table/add-tickers-table.component'
import { TickerSelectedTableComponent } from '../ticker-selected-table/ticker-selected-table.component'

export type EditDialogData = {
  watchlist: WatchlistView
}

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
    AddTickersTableComponent,
    TickerSelectedTableComponent
  ],
  templateUrl: './edit-watchlist-dialog.component.html',
  styleUrl: './edit-watchlist-dialog.component.scss',
  providers: [EditWatchlistService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWatchlistDialogComponent {
  public nameControl: FormControl | undefined

  private _watchlistName: Signal<string | undefined> | undefined

  constructor(
    private _editWatchlistService: EditWatchlistService,
    private _dialogRef: MatDialogRef<EditWatchlistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _dialogData: EditDialogData
  ) {
    if (this._dialogData) {
      this._editWatchlistService.updateStateWithWatchlist(this._dialogData.watchlist)
    }

    this.initFormControl()

    effect(
      () => {
        const watchlistName = this._watchlistName?.()
        if (!watchlistName) {
          return
        }
        this._editWatchlistService.updateWatchlistName(watchlistName)
      },
      { allowSignalWrites: true }
    )
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
    const name = this._editWatchlistService.watchlistState().name
    this.nameControl = new FormControl(name, Validators.required)

    this._watchlistName = toSignal(
      this.nameControl.valueChanges.pipe(
        distinctUntilChanged(),
        map((value) => (value == null ? '' : value))
      )
    )
  }
}
