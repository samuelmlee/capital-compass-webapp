import { HttpClient } from '@angular/common/http'
import { Injectable, Signal, signal } from '@angular/core'
import { catchError, map, of } from 'rxjs'
import { Result } from 'src/app/shared/model/result'
import { environment } from 'src/environments/environment'
import { type User } from '../../users/model/user'

type LogOutApiResponse = { logoutUrl: string; idToken: string }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isAuthenticated = signal<Result<boolean>>({ value: false, error: null })
  private readonly user = signal<Result<User | null>>({ value: null, error: null })

  private readonly apiUrl = environment.apiUrl
  private readonly clientId = environment.gatewayClientId
  private readonly logoutUri = location.origin

  public constructor(private readonly httpClient: HttpClient) {}

  public get getIsAuthenticated(): Signal<Result<boolean>> {
    return this.isAuthenticated.asReadonly()
  }

  public get getUser(): Signal<Result<User | null>> {
    return this.user.asReadonly()
  }

  public authenticate(): void {
    this.httpClient
      .get<User>(`${this.apiUrl}/user`, {
        withCredentials: true
      })
      .pipe(
        map((user) => ({ value: user, error: null })),
        catchError((err) => of({ value: false, error: err }))
      )
      .subscribe((result) => {
        this.isAuthenticated.set({ value: typeof result.value == User, error: null })
        this.user.set(result)
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
