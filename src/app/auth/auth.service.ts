import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../users/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    private apiUrl = 'http://localhost:8082';

    authenticate(): Observable<User> {
        return this.httpClient.get<User>(`${this.apiUrl}/user`, {
            withCredentials: true,
        });
    }

    login(): void {
        window.open(`${this.apiUrl}/oauth2/authorization/keycloak`, '_self');
    }

    logout(): Observable<any> {
        return this.httpClient.post<any>(
            `${this.apiUrl}/logout`,
            {},
            {
                withCredentials: true,
            }
        );
    }
}
