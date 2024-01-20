import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Result } from 'src/app/shared/model/result'
import { AdminUserDTO } from '../../model/admin-user'
import { AdminUserService } from '../../service/admin-user.service'

@Component({
  selector: 'app-admin-user-panel',
  standalone: true,
  imports: [],
  templateUrl: './admin-user-panel.component.html',
  styleUrl: './admin-user-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUserPanelComponent {
  private _adminUserService: AdminUserService

  public adminUsersSignal: Result<AdminUserDTO[]>

  constructor(adminUserService: AdminUserService) {
    this._adminUserService = adminUserService
    this.adminUsersSignal = this._adminUserService.adminUsersResult
  }

  public ngOnInit(): void {
    this._adminUserService.fetchAdminUsers()
  }
}
