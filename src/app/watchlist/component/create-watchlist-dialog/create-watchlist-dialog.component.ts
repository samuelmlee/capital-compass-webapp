import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

@Component({
  selector: 'app-create-watchlist-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './create-watchlist-dialog.component.html',
  styleUrl: './create-watchlist-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateWatchlistDialogComponent {
  public nameControl = new FormControl('')

  public constructor(private _dialogRef: MatDialogRef<CreateWatchlistDialogComponent>) {}
}
