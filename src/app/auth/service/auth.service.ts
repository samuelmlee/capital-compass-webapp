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

  private readonly apiUrl = environment.apiUrl
  private readonly clientId = environment.gatewayClientId
  private readonly logoutUri = location.origin
  private readonly authenticateSubject = new Subject<void>()

  public constructor(private readonly httpClient: HttpClient) {
    this.user = fromObsToSignal<User>(this.authenticateSubject.pipe(switchMap(() => this.getUserDetails())))
  }

  public authenticate(): void {
    this.authenticateSubject.next()
  }

  public getUserDetails(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/user`, {
      withCredentials: true
    })
  }

  public login(): void {
    window.open(`${this.apiUrl}/oauth2/authorization/keycloak`, '_self')
  }

  public logout(): void {
    this.httpClient
      .get<LogOutApiResponse>(`${this.apiUrl}/api/logout`, { withCredentials: true })
      .pipe(
        map((response) => ({ value: response, error: null })),
        catchError((err) => of({ value: null, error: err }))
      )
      .subscribe((result) => {
        const keycloakLogoutUrl = `${result.value?.logoutUrl}?client_id=${this.clientId}&post_logout_redirect_uri=${this.logoutUri}`
        window.open(keycloakLogoutUrl, '_self')
      })
  }
}
