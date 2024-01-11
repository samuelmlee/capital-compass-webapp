import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { AuthService } from 'src/app/auth/service/auth.service'

type NavbarElement = { title: string; icon: string; link: string; allowedRoles?: string[] }

const ALL_ELEMENTS: NavbarElement[] = [
  { title: 'Watchlist', icon: 'visibility', link: '/watchlist', allowedRoles: ['USER'] },
  { title: 'Search', icon: 'search', link: '/search' },
  {
    title: 'Manage Users',
    icon: 'supervisor_account',
    link: '/admin-user',
    allowedRoles: ['ADMIN']
  }
]

const UNAUTHENTICATED_ELEMENTS: NavbarElement[] = [
  { title: 'Search', icon: 'search', link: '/search' }
]

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatSidenavModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
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
