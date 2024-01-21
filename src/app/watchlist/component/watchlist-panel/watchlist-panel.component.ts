import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, computed } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ErrorMessageComponent } from 'src/app/shared/component/error-message/error-message.component'
import { WatchlistService } from '../../service/watchlist.service'
import { EditWatchlistDialogComponent } from '../edit-watchlist-dialog/edit-watchlist-dialog.component'
import { WatchlistTableComponent } from '../watchlist-table/watchlist-table.component'

@Component({
  selector: 'app-watch-list-panel',
  standalone: true,
  imports: [
    CommonModule,
    ErrorMessageComponent,
    MatButtonModule,
    MatSnackBarModule,
    WatchlistTableComponent
  ],
  templateUrl: './watchlist-panel.component.html',
  styleUrl: './watchlist-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistPanelComponent implements OnInit {
  public $watchlists = computed(() => {
    const watchlists = this._watchlistService.watchlistsResult.value()
    return watchlists?.sort((a, b) => (a.name < b.name ? -1 : 1))
  })

  public $watchlistsError = this._watchlistService.watchlistsResult.error

  constructor(
    private _dialog: MatDialog,
    private _watchlistService: WatchlistService
  ) {}
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
