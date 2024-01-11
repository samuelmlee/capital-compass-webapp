import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { AuthService } from './auth.service'

export function authGuard(...allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService: AuthService = inject(AuthService)

    const user = authService.user.value()

    if (!allowedRoles?.length) {
      return true
    }
    if (!user) {
      return false
    }

    return user?.roles.some((role) => allowedRoles.includes(role))
  }
}
