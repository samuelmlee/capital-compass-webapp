import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService)

  if (authService.getIsAuthenticated().value) {
    return true
  }
  authService.login()
  return false
}
