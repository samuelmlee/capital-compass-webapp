import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AuthService } from 'src/app/auth/service/auth.service'
import { ErrorMessageComponent } from 'src/app/shared/component/error-message/error-message.component'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ErrorMessageComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  public $user = this.authService.userResult.value

  public $userError = this.authService.userResult.error

  constructor(private readonly authService: AuthService) {}
}
