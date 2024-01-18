import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { AuthService } from 'src/app/auth/service/auth.service'

type SideNavElement = { title: string; icon: string; link: string; allowedRoles?: string[] }

const ALL_ELEMENTS: SideNavElement[] = [
  { title: 'Watchlist', icon: 'visibility', link: '/watchlist', allowedRoles: ['USER'] },
  { title: 'Search', icon: 'search', link: '/search' },
  {
    title: 'Manage Users',
    icon: 'supervisor_account',
    link: '/admin-user',
    allowedRoles: ['ADMIN']
  }
]

const UNAUTHENTICATED_ELEMENTS: SideNavElement[] = [
  { title: 'Search', icon: 'search', link: '/search' }
]

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatSidenavModule, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent {
  constructor(private _authservice: AuthService) {}

  public readonly navElements = computed(() => {
    const user = this._authservice.user.value()
    if (!user) {
      return UNAUTHENTICATED_ELEMENTS
    }
    return ALL_ELEMENTS.filter((element) => {
      if (!element.allowedRoles?.length) {
        return true
      }
      return user.roles.some((role) => element.allowedRoles?.includes(role))
    })
  })
}
