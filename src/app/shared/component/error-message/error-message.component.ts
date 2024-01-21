import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {
  @Input()
  public set errorMessage(message: unknown) {
    if (typeof message === 'string') {
      this._$errorMessage.set(message ?? '')
    }
  }

  private _$errorMessage = signal('')

  public $errorMessage = this._$errorMessage.asReadonly()
}
