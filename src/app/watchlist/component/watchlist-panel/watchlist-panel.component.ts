import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewContainerRef,
  computed,
  effect
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ErrorMessageComponent } from 'src/app/shared/component/error-message/error-message.component'
import { LoadingIndicatorComponent } from 'src/app/shared/component/loading-indicator/loading-indicator.component'
import { TickerWebsocketService } from 'src/app/shared/service/ticker-websocket.service'
import { CLOSE_DIALOG_SOURCE } from '../../model/edit-watchlist-config'
import { WatchlistService } from '../../service/watchlist.service'
import { ManageWatchlistDialogComponent } from '../manage-watchlist-dialog/manage-watchlist-dialog.component'
import { WatchlistTableComponent } from '../watchlist-table/watchlist-table.component'

@Component({
  selector: 'app-watch-list-panel',
  standalone: true,
  imports: [
    CommonModule,
    ErrorMessageComponent,
    LoadingIndicatorComponent,
    MatButtonModule,
    MatSnackBarModule,
    WatchlistTableComponent
  ],
  providers: [WatchlistService, TickerWebsocketService],
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
  public loading$ = this._watchlistService.fetchWatchListsLoading

  private _$watchlistSymbols = computed(() => {
    const watchlists = this._watchlistService.watchlistsResult.value()
    return watchlists?.flatMap((watchlist) =>
      watchlist.tickerSnapshots.map((snapshot) => snapshot.symbol)
    )
  })

  private _sendSubscriptionMessageEffect = effect(() => {
    const watchlistSymbols = this._$watchlistSymbols()
    if (!watchlistSymbols?.length) {
      return
    }
    this._tickerWebsocketService.sendSubscriptionMessage(watchlistSymbols)
  })

  constructor(
    private _dialog: MatDialog,
    private _watchlistService: WatchlistService,
    private _viewContainerRef: ViewContainerRef,
    private _tickerWebsocketService: TickerWebsocketService
  ) {}
  public ngOnInit(): void {
    this._watchlistService.fetchWatchLists()
  }

  public openCreateDialog(): void {
    const dialogRef = this._dialog.open<ManageWatchlistDialogComponent, null, CLOSE_DIALOG_SOURCE>(
      ManageWatchlistDialogComponent,
      {
        width: '50vw',
        height: '95vh',
        hasBackdrop: true,
        disableClose: true,
        viewContainerRef: this._viewContainerRef
      }
    )

    dialogRef.afterClosed().subscribe((result: CLOSE_DIALOG_SOURCE | undefined) => {
      if (result === CLOSE_DIALOG_SOURCE.SAVE) {
        this._watchlistService.fetchWatchLists()
      }
    })
  }
}
