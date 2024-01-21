import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ErrorMessageComponent } from 'src/app/shared/component/error-message/error-message.component'
import { AdminUserService } from '../../service/admin-user.service'

@Component({
  selector: 'app-admin-user-panel',
  standalone: true,
  imports: [ErrorMessageComponent],
  templateUrl: './admin-user-panel.component.html',
  styleUrl: './admin-user-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUserPanelComponent {
  public $adminUsers = this._adminUserService.adminUsersResult.value

  public $adminUsersError = this._adminUserService.adminUsersResult.error

  constructor(private _adminUserService: AdminUserService) {}

  public ngOnInit(): void {
    this._adminUserService.fetchAdminUsers()
  }
}
