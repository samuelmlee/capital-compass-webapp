import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, computed, effect } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar'
import { WatchlistService } from '../../service/watchlist.service'
import { EditWatchlistDialogComponent } from '../edit-watchlist-dialog/edit-watchlist-dialog.component'
import { WatchlistTableComponent } from '../watchlist-table/watchlist-table.component'

@Component({
  selector: 'app-watch-list-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, WatchlistTableComponent],
  templateUrl: './watchlist-panel.component.html',
  styleUrl: './watchlist-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistPanelComponent implements OnInit {
  public $watchlists = computed(() => {
    const watchlists = this._watchlistService.watchlistsResult.value()
    return watchlists?.sort((a, b) => (a.name < b.name ? -1 : 1))
  })

  private horizontalPosition: MatSnackBarHorizontalPosition = 'end'
  private verticalPosition: MatSnackBarVerticalPosition = 'top'

  constructor(
    private _dialog: MatDialog,
    private _watchlistService: WatchlistService,
    private _snackBar: MatSnackBar
  ) {
    effect(() => {
      const message = this._watchlistService.watchlistsResult.error() as string
      if (!message) {
        return
      }
      this._snackBar.open(message, 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    })
  }
  public ngOnInit(): void {
    this._watchlistService.fetchWatchLists()
  }

  public openCreateDialog(): void {
    this._dialog.open(EditWatchlistDialogComponent, {
      width: '50vw',
      height: '90vh',
      hasBackdrop: true,
      disableClose: true
    })
  }
}
