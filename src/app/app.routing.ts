import { RouterModule, Routes } from '@angular/router'
import { authGuard } from './auth/service/auth.guard'
import { LandingComponent } from './core/component/landing/landing.component'

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'profile',
    loadComponent: () => import('./users/component/profile/profile.component').then((mod) => mod.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./tickers/component/tickers-table/tickers-table.component').then((mod) => mod.TickersTableComponent),
    canActivate: [authGuard]
  }
]

export const routing = RouterModule.forRoot(routes, {
  bindToComponentInputs: true
})
