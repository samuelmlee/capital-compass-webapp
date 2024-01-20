import { ChangeDetectionStrategy, Component, Inject, computed } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { WatchDialogData } from '../../model/watchlist-dialog-data'
import { EditWatchlistService } from '../../service/edit-watchlist.service'

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
  public $watchlistName = computed(() => {
    return this._editWatchlistService.$watchlistState().name
  })

  constructor(
    private _editWatchlistService: EditWatchlistService,
    private _dialogRef: MatDialogRef<DeleteWatchlistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _dialogData: WatchDialogData
  ) {
    if (this._dialogData) {
      this._editWatchlistService.updateStateWithWatchlist(this._dialogData.watchlist)
    }
  }

  public deleteWatchList(): void {
    this._editWatchlistService.deleteWatchList()
    this._dialogRef.close()
  }
}
