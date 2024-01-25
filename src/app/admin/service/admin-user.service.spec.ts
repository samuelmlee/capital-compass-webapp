import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { AdminUserDTO } from '../model/admin-user'
import { AdminUserService } from './admin-user.service'

describe('AdminUserService', () => {
  let service: AdminUserService
  let httpTestingController: HttpTestingController
  const mockErrorHandlingService = {
    getErrorMessage: jest.fn().mockImplementation((error: HttpErrorResponse): string => {
      switch (error.status) {
        case 403:
          return `Forbidden access to Users for Admin.`
        case 500:
          return `Server error occurred for Users for Admin.`
        default:
          return ''
      }
    })
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminUserService,
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService }
      ]
    })

    service = TestBed.inject(AdminUserService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  it('should fetch admin users successfully', () => {
    const mockUsers = [{ name: 'User1' }, { name: 'User2' }]
    service.fetchAdminUsers()

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/users/admin-users`)
    expect(req.request.method).toBe('GET')
    req.flush(mockUsers)

    const user: AdminUserDTO[] | undefined = service.adminUsersResult.value()
    expect(user).toEqual(mockUsers)
  })

  it('should handle empty response for admin users', () => {
    service.fetchAdminUsers()

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/users/admin-users`)
    expect(req.request.method).toBe('GET')
    req.flush([])

    const user: AdminUserDTO[] | undefined = service.adminUsersResult.value()
    expect(user).toEqual([])
  })

  it('should emit the error if admin users returned a client error', () => {
    service.fetchAdminUsers()

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/users/admin-users`)
    expect(req.request.method).toBe('GET')
    req.error(new ProgressEvent('Network error'), {
      status: 403,
      statusText: 'Forbidden'
    })

    const error: unknown = service.adminUsersResult.error()
    expect(error).toEqual(`Forbidden access to Users for Admin.`)
  })

  it('should emit the error if admin users returned a server error', () => {
    service.fetchAdminUsers()

    const req = httpTestingController.expectOne(`${service['_apiUrl']}/users/admin-users`)
    expect(req.request.method).toBe('GET')
    req.error(new ProgressEvent('Network error'), {
      status: 500,
      statusText: 'Internal Server Error'
    })

    const error: unknown = service.adminUsersResult.error()
    expect(error).toEqual(`Server error occurred for Users for Admin.`)
  })
})
