import { ChangeDetectionStrategy, Component, Inject, effect, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { SnackbarService } from 'src/app/core/service/snack-bar.service'
import { DeleteWatchlistView } from '../../model/watchlist'
import { WatchDialogData } from '../../model/watchlist-dialog-data'
import { WatchlistService } from '../../service/watchlist.service'

@Component({
  selector: 'app-delete-watchlist-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-watchlist-dialog.component.html',
  styleUrl: './delete-watchlist-dialog.component.scss',
  providers: [WatchlistService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteWatchlistDialogComponent {
  private _$watchlistView = signal<DeleteWatchlistView>({
    name: '',
    id: 0
  })
  public $watchlistView = this._$watchlistView.asReadonly()

  constructor(
    private _wathclistService: WatchlistService,
    private _dialogRef: MatDialogRef<DeleteWatchlistDialogComponent>,
    private _snackBarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) private _dialogData: WatchDialogData
  ) {
    if (this._dialogData) {
      this._$watchlistView.set(this._dialogData.watchlist)
    }

    this.initWatchlistResultEffect()
  }

  public deleteWatchList(): void {
    const id = this.$watchlistView().id
    if (!id) {
      return
    }
    this._wathclistService.deleteWatchlist(id)
  }

  private initWatchlistResultEffect(): void {
    effect(() => {
      const errorMessage = this._wathclistService.watchlistDeletedResult?.error()
      const watchlist = this._wathclistService.watchlistDeletedResult?.value()
      if (errorMessage) {
        this._snackBarService.error(errorMessage as string)
        return
      }
      if (!watchlist) {
        return
      }
      this._snackBarService.success('Watchlist has been deleted')
      this._dialogRef.close()
    })
  }
}
