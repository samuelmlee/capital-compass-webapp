import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, type Observable } from 'rxjs'
import { type User } from '../users/user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated$ = new BehaviorSubject<boolean>(false)
  public user$ = new BehaviorSubject<User | undefined>(undefined)

  public constructor (private readonly httpClient: HttpClient) {}

  private readonly apiUrl = 'http://localhost:8082'

  public initAuthentication (): void {
    this.authenticate().subscribe((user) => {
      if (user != null) {
        this.isAuthenticated$.next(true)
        this.user$.next(user)
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
        this.isAuthenticated$.next(false)
        this.user$.next(undefined)
      })
  }
}
