import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { CreateWatchlistDialogComponent } from '../create-watchlist-dialog/create-watchlist-dialog.component'

@Component({
  selector: 'app-watch-list-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist-panel.component.html',
  styleUrl: './watchlist-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchListPanelComponent {
  public constructor(private dialog: MatDialog) {}

  public openCreateDialog(): void {
    this.dialog.open(CreateWatchlistDialogComponent, {
      width: '50vw',
      hasBackdrop: true
    })
  }
}
