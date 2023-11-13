import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../users/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public isAuthenticated$ = new BehaviorSubject<boolean>(false);
    public user$ = new BehaviorSubject<User | undefined>(undefined);

    constructor(private httpClient: HttpClient) {}

    private apiUrl = 'http://localhost:8082';

    initAuthentication() {
        this.authenticate().subscribe((user) => {
            if (user) {
                this.isAuthenticated$.next(true);
                this.user$.next(user);
            }
        });
    }

    authenticate(): Observable<User> {
        return this.httpClient.get<User>(`${this.apiUrl}/user`, {
            withCredentials: true,
        });
    }

    login(): void {
        window.open(`${this.apiUrl}/oauth2/authorization/keycloak`, '_self');
    }

    public logout(): void {
        this.httpClient
            .post<any>(
                `${this.apiUrl}/logout`,
                {},
                {
                    withCredentials: true,
                }
            )
            .subscribe(() => {
                this.isAuthenticated$.next(false);
                this.user$.next(undefined);
            });
    }
}
