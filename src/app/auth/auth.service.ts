import { HttpClient } from '@angular/common/http'
import { Injectable, signal } from '@angular/core'
import { type Observable } from 'rxjs'
import { type User } from '../users/user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly isAuthenticated = signal<boolean>(false)
  public readonly user = signal<User | null>(null)

  public constructor (private readonly httpClient: HttpClient) {}

  private readonly apiUrl = 'http://localhost:8082'

  public initAuthentication (): void {
    this.authenticate().subscribe((user) => {
      if (user != null) {
        this.isAuthenticated.set(true)
        this.user.set(user)
      }
    })
  }

  public authenticate (): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/user`, {
      withCredentials: true
    })
  }

  public login (): void {
    window.open(`${this.apiUrl}/oauth2/authorization/keycloak`, '_self')
  }

  public logout (): void {
    this.httpClient
      .post<any>(
                `${this.apiUrl}/logout`,
                // TODO: send csrf token
                {},
                {
                  withCredentials: true
                }
    )
      .subscribe(() => {
        this.isAuthenticated.set(false)
        this.user.set(null)
      })
  }
}
