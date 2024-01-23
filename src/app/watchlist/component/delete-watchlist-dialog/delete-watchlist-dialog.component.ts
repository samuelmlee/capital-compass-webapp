import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { DeleteWatchlistView } from '../../model/watchlist'
import { WatchDialogData } from '../../model/watchlist-dialog-data'
import { EditWatchlistService } from '../../service/edit-watchlist.service'
import { WatchlistService } from '../../service/watchlist.service'

@Component({
  selector: 'app-delete-watchlist-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-watchlist-dialog.component.html',
  styleUrl: './delete-watchlist-dialog.component.scss',
  providers: [EditWatchlistService],
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
    @Inject(MAT_DIALOG_DATA) private _dialogData: WatchDialogData
  ) {
    if (this._dialogData) {
      this._$watchlistView.set(this._dialogData.watchlist)
    }
  }

  public deleteWatchList(): void {
    const id = this.$watchlistView().id
    if (!id) {
      return
    }
    this._wathclistService.deleteWatchlist(id)
    this._dialogRef.close()
  }
}
