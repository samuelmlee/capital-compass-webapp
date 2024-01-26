import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { SnackbarService } from '../../core/service/snack-bar.service'
import { User } from '../../users/model/user'
import { LogOutApiResponse } from '../model/logout-api-response'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: AuthService
  let httpTestingController: HttpTestingController
  let mockSnackbarService: Partial<SnackbarService>
  let mockErrorHandlingService: Partial<ErrorHandlingService>

  beforeEach(() => {
    mockSnackbarService = { error: jest.fn(), success: jest.fn() }
    mockErrorHandlingService = {
      getErrorMessage: jest.fn().mockImplementation((error: HttpErrorResponse): string => {
        switch (error.status) {
          case 403:
            return `Forbidden access to User Profile.`
          default:
            return ''
        }
      })
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService }
      ]
    })

    authService = TestBed.inject(AuthService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should fetch user details when authenticate is called', () => {
    const johnDoe: User = {
      id: '1',
      email: 'john.doe@mail.com',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['USER'],
      username: 'john.doe'
    }
    authService.authenticate()

    const req = httpTestingController.expectOne(`${authService['_authUrl']}/v1/auth/user`)
    expect(req.request.method).toEqual('GET')
    req.flush(johnDoe)

    const returnedUser = authService.userResult.value()
    expect(returnedUser).toEqual(johnDoe)
  })

  it('should emit the error if authenticate returned a HttpErrorResponse', () => {
    authService.authenticate()

    const req = httpTestingController.expectOne(`${authService['_authUrl']}/v1/auth/user`)
    expect(req.request.method).toBe('GET')
    req.error(new ProgressEvent('Network error'), {
      status: 403,
      statusText: 'Forbidden'
    })

    const error: unknown = authService.userResult.error()
    expect(error).toEqual(`Forbidden access to User Profile.`)
  })

  it('should navigate to login URL when login is called', () => {
    const spy = jest.spyOn(window, 'open').mockImplementation()
    authService.login()

    expect(spy).toHaveBeenCalledWith(
      `${authService['_authUrl']}/oauth2/authorization/keycloak`,
      '_self'
    )
  })

  it('should navigate to logout URL on successful logout', () => {
    const mockLogoutResponse: LogOutApiResponse = {
      logoutUrl: 'http://logout.url',
      idToken: 'token'
    }
    const windowSpy = jest.spyOn(window, 'open').mockImplementation()

    authService.logout()

    const req = httpTestingController.expectOne(`${authService['_authUrl']}/v1/auth/logout`)
    expect(req.request.method).toEqual('GET')
    req.flush(mockLogoutResponse)

    const expectedLogoutUrl = `${mockLogoutResponse.logoutUrl}?client_id=${authService['_clientId']}&post_logout_redirect_uri=${authService['_logoutUri']}`
    expect(windowSpy).toHaveBeenCalledWith(expectedLogoutUrl, '_self')
  })

  it('should handle HTTP errors during logout', () => {
    const errorEvent = new ProgressEvent('error')
    authService.logout()

    const req = httpTestingController.expectOne(`${authService['_authUrl']}/v1/auth/logout`)
    req.error(errorEvent, { status: 500, statusText: 'Internal Server Error' })

    expect(mockSnackbarService.error).toHaveBeenCalledWith('Error occurred during logout')
  })
})
