import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { EMPTY, Observable, Subject, catchError, switchMap, take } from 'rxjs'
import { environment } from '../../../environments/environment'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { SnackbarService } from '../../core/service/snack-bar.service'
import { Result } from '../../shared/model/result'
import { fromObsToSignal } from '../../shared/utils/from-obs-to-signal'
import { type User } from '../../users/model/user'
import { LogOutApiResponse } from '../model/logout-api-response'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userResult: Result<User>

  private readonly _authUrl = environment.authUrl
  private readonly _clientId = environment.gatewayClientId
  private readonly _logoutUri = location.origin
  private readonly _authenticateSubject = new Subject<void>()

  constructor(
    private readonly _httpClient: HttpClient,
    private _errorHandlingService: ErrorHandlingService,
    private _snackBarService: SnackbarService
  ) {
    this.userResult = fromObsToSignal<User>(
      this._authenticateSubject.pipe(switchMap(() => this.getUserDetails())),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'User Profile')
    )
  }

  public authenticate(): void {
    this._authenticateSubject.next()
  }

  public getUserDetails(): Observable<User> {
    return this._httpClient.get<User>(`${this._authUrl}/v1/auth/user`, {
      withCredentials: true
    })
  }

  public login(): void {
    window.open(`${this._authUrl}/oauth2/authorization/keycloak`, '_self')
  }

  public logout(): void {
    this._httpClient
      .get<LogOutApiResponse>(`${this._authUrl}/v1/auth/logout`, { withCredentials: true })
      .pipe(
        take(1),
        catchError(() => {
          this._snackBarService.error('Error occurred during logout')
          return EMPTY
        })
      )
      .subscribe((result) => {
        const keycloakLogoutUrl = `${result.logoutUrl}?client_id=${this._clientId}&post_logout_redirect_uri=${this._logoutUri}`
        window.open(keycloakLogoutUrl, '_self')
      })
  }
}
