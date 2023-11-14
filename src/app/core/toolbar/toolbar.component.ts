import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router'
import { AuthService } from 'src/app/auth/auth.service'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule]
})
export class ToolbarComponent {
  @Input() public title: string = ''

  public isAuthenticated = this.authService.isAuthenticated
  public user = this.authService.user

  public constructor(private readonly authService: AuthService) {}

  public logInClicked(): void {
    this.authService.login()
  }

  public logOutClicked(): void {
    this.authService.logout()
  }
}
