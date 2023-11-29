import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, catchError, map, of, switchMap } from 'rxjs'
import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { type User } from '../../users/model/user'

type LogOutApiResponse = { logoutUrl: string; idToken: string }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Result<User>

  private readonly _apiUrl = environment.apiUrl
  private readonly _clientId = environment.gatewayClientId
  private readonly _logoutUri = location.origin
  private readonly _authenticateSubject = new Subject<void>()

  constructor(private readonly _httpClient: HttpClient) {
    this.user = fromObsToSignal<User>(this._authenticateSubject.pipe(switchMap(() => this.getUserDetails())))
  }

  public authenticate(): void {
    this._authenticateSubject.next()
  }

  public getUserDetails(): Observable<User> {
    return this._httpClient.get<User>(`${this._apiUrl}/user`, {
      withCredentials: true
    })
  }

  public login(): void {
    window.open(`${this._apiUrl}/oauth2/authorization/keycloak`, '_self')
  }

  public logout(): void {
    this._httpClient
      .get<LogOutApiResponse>(`${this._apiUrl}/api/logout`, { withCredentials: true })
      .pipe(
        map((response) => ({ value: response, error: null })),
        catchError((err) => of({ value: null, error: err }))
      )
      .subscribe((result) => {
        const keycloakLogoutUrl = `${result.value?.logoutUrl}?client_id=${this._clientId}&post_logout_redirect_uri=${this._logoutUri}`
        window.open(keycloakLogoutUrl, '_self')
      })
  }
}
