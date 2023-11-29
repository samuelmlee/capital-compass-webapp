import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import { AuthService } from '../../service/auth.service'

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  public isAuthenticated = computed(() => this._authService.user.value() != null)

  constructor(private readonly _authService: AuthService) {}

  public logInClicked(): void {
    this._authService.login()
  }

  public logOutClicked(): void {
    this._authService.logout()
  }
}
