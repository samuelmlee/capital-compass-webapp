import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router'
import { AuthComponent } from 'src/app/auth/component/auth/auth.component'
import { AuthService } from 'src/app/auth/service/auth.service'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
    AuthComponent
  ]
})
export class ToolbarComponent {
  @Input() public title: string = ''

  public $user = this._authService.userResult.value

  constructor(private readonly _authService: AuthService) {}
}
