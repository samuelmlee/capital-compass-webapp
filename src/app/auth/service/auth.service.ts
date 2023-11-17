import { HttpClient } from '@angular/common/http'
import { Injectable, signal } from '@angular/core'
import { tap } from 'rxjs'
import { environment } from 'src/environments/environment'
import { type User } from '../../users/model/user'

type LogOutApiResponse = { logoutUrl: string; idToken: string }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly isAuthenticated = signal<boolean>(false)
  public readonly user = signal<User | null>(null)

  public constructor(private readonly httpClient: HttpClient) {}

  private readonly apiUrl = environment.apiUrl
  private readonly clientId = environment.gatewayClientId
  private readonly logoutUri = location.origin

  public authenticate(): void {
    this.httpClient
      .get<User>(`${this.apiUrl}/user`, {
        withCredentials: true
      })
      .pipe(
        tap({
          error: (e) => {
            console.log('Unauthenticated or Error fetching User :', e)
          }
        })
      )
      .subscribe((user) => {
        if (user != null) {
          this.isAuthenticated.set(true)
          this.user.set(user)
        }
      })
  }

  public login(): void {
    window.open(`${this.apiUrl}/oauth2/authorization/keycloak`, '_self')
  }

  public logout(): void {
    this.httpClient
      .get<LogOutApiResponse>(`${this.apiUrl}/api/logout`, { withCredentials: true })
      .pipe(
        tap({
          error: (e) => {
            console.log('Logout error from Gateway:', e)
          }
        })
      )
      .subscribe((response) => {
        const keycloakLogoutUrl = `${response.logoutUrl}?client_id=${this.clientId}&post_logout_redirect_uri=${this.logoutUri}`
        window.open(keycloakLogoutUrl, '_self')
      })
  }
}