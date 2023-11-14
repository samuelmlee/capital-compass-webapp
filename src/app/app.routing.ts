import { RouterModule, Routes } from '@angular/router'
import { LandingComponent } from './core/landing/landing.component'

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'profile',
    loadComponent: () => import('./users/profile/profile.component').then((mod) => mod.ProfileComponent)
  }
]

export const routing = RouterModule.forRoot(routes, {
  bindToComponentInputs: true
})
