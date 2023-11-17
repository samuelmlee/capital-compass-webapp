import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
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
  public isAuthenticated = this.authService.isAuthenticated

  public constructor(private readonly authService: AuthService) {}

  public logInClicked(): void {
    this.authService.login()
  }

  public logOutClicked(): void {
    this.authService.logout()
  }
}