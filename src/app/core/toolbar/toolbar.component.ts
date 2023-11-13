import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { AuthService } from 'src/app/auth/auth.service'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  @Input() public title: string = ''

  public isAuthenticated = this.authService.isAuthenticated
  public user = this.authService.user

  public constructor (private readonly authService: AuthService) {}

  public logInClicked (): void {
    this.authService.login()
  }

  public logOutClicked (): void {
    this.authService.logout()
  }
}
