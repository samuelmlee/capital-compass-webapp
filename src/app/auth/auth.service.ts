import { HttpClient } from '@angular/common/http'
import { Injectable, signal } from '@angular/core'
import { catchError, throwError, type Observable } from 'rxjs'
import { type User } from '../users/user'

type LogOutApiResponse = { logoutUrl: string; idToken: string }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly isAuthenticated = signal<boolean>(false)
  public readonly user = signal<User | null>(null)

  public constructor(private readonly httpClient: HttpClient) {}

  private readonly apiUrl = 'http://localhost:8082'
  private readonly logoutUri = 'http://localhost:4200'
  private readonly clientId = 'capital-compass-gateway-client'

  public initAuthentication(): void {
    this.authenticate().subscribe((user) => {
      if (user != null) {
        this.isAuthenticated.set(true)
        this.user.set(user)
      }
    })
  }

  public authenticate(): Observable<User> {
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
        catchError((e) => {
          console.log('Logout error:', e)
          return throwError(() => new Error(e))
        })
      )
      .subscribe((response) => {
        const keycloakLogoutUrl = `${response.logoutUrl}?client_id=${this.clientId}&post_logout_redirect_uri=${this.logoutUri}`
        window.open(keycloakLogoutUrl, '_self')
      })
  }
}
