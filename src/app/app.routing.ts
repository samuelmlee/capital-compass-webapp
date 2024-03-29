import { RouterModule, Routes } from '@angular/router'
import { authGuard } from './auth/service/auth.guard'
import { LandingComponent } from './core/component/landing/landing.component'

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'profile',
    loadComponent: () =>
      import('./users/component/profile/profile.component').then((mod) => mod.ProfileComponent),
    canActivate: [authGuard('USER')]
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./tickers/component/tickers-panel/tickers-panel.component').then(
        (mod) => mod.TickersPanelComponent
      )
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./watchlist/component/watchlist-panel/watchlist-panel.component').then(
        (mod) => mod.WatchlistPanelComponent
      ),
    canActivate: [authGuard('USER')]
  },
  {
    path: 'ticker-details/:ticker',
    loadComponent: () =>
      import('./tickers/component/tickers-detail/tickers-detail.component').then(
        (mod) => mod.TickersDetailComponent
      )
  },
  {
    path: 'admin-user',
    loadComponent: () =>
      import('./admin/component/admin-user-panel/admin-user-panel.component').then(
        (mod) => mod.AdminUserPanelComponent
      ),
    canActivate: [authGuard('ADMIN')]
  }
]

export const routing = RouterModule.forRoot(routes, {
  bindToComponentInputs: true
})
