import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-watchlist-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-watchlist-dialog.component.html',
  styleUrl: './create-watchlist-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateWatchlistDialogComponent {

}
