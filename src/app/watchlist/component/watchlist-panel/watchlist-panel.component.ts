import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewContainerRef,
  computed
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ErrorMessageComponent } from 'src/app/shared/component/error-message/error-message.component'
import { LoadingIndicatorComponent } from 'src/app/shared/component/loading-indicator/loading-indicator.component'
import {
  RxStompService,
  rxStompServiceFactory
} from 'src/app/shared/service/rx-stomp-service.service'
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
  providers: [
    WatchlistService,
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory
    }
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

  public loading$ = this._watchlistService.fetchWatchListsLoading

  constructor(
    private _dialog: MatDialog,
    private _watchlistService: WatchlistService,
    private _viewContainerRef: ViewContainerRef,
    private _rxStompService: RxStompService
  ) {}
  public ngOnInit(): void {
    this._watchlistService.fetchWatchLists()

    this._rxStompService.watch('/topic/ticker-price').subscribe((message: unknown) => {
      console.log('Message from /topic/ticker-price :', message)
    })
  }

  public openCreateDialog(): void {
    const dialogRef = this._dialog.open(ManageWatchlistDialogComponent, {
      width: '50vw',
      height: '95vh',
      hasBackdrop: true,
      disableClose: true,
      viewContainerRef: this._viewContainerRef
    })

    dialogRef.afterClosed().subscribe(() => {
      this._watchlistService.fetchWatchLists()
    })
  }
}
