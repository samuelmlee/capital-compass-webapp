import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { authGuard } from './auth.guard'
import { AuthService } from './auth.service'

describe('authGuard', () => {
  const mockAuthService = {
    userResult: {
      value: jest.fn()
    }
  }

  const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot
  const mockRouterStateSnapshot = {} as RouterStateSnapshot

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    })
  })

  describe('authGuard', () => {
    it('should allow access when no roles are required', () => {
      mockAuthService.userResult.value.mockReturnValue(null)
      const guard = authGuard()
      const result = TestBed.runInInjectionContext(() =>
        guard(mockActivatedRouteSnapshot, mockRouterStateSnapshot)
      )
      expect(result).toBe(true)
    })

    it('should deny access when user is not logged in', () => {
      mockAuthService.userResult.value.mockReturnValue(null)
      const guard = authGuard('USER')

      const result = TestBed.runInInjectionContext(() =>
        guard(mockActivatedRouteSnapshot, mockRouterStateSnapshot)
      )
      expect(result).toBe(false)
    })

    it('should allow access when user has required role', () => {
      mockAuthService.userResult.value.mockReturnValue({ roles: ['ADMIN'] })
      const guard = authGuard('ADMIN')

      const result = TestBed.runInInjectionContext(() =>
        guard(mockActivatedRouteSnapshot, mockRouterStateSnapshot)
      )
      expect(result).toBe(true)
    })

    it('should deny access when user does not have required role', () => {
      mockAuthService.userResult.value.mockReturnValue({ roles: ['USER'] })
      const guard = authGuard('ADMIN')
      const result = TestBed.runInInjectionContext(() =>
        guard(mockActivatedRouteSnapshot, mockRouterStateSnapshot)
      )
      expect(result).toBe(false)
    })
  })
})
