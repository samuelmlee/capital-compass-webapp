import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'

type NavbarElement = { title: string; icon: string; link: string }

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatSidenavModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
  public readonly navElements = signal<NavbarElement[]>([
    { title: 'Watchlist', icon: 'visibility', link: '/watchlist' },
    { title: 'Search', icon: 'search', link: '/search' },
    { title: 'Manage Users', icon: 'supervisor_account', link: '/admin-user' }
  ])
}
