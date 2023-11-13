import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../users/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    authenticate(): Observable<User> {
        return this.httpClient.get<User>(`/user`, {
            withCredentials: true,
        });
    }

    login(): void {
        window.open(`/oauth2/authorization/keycloak`, '_self');
    }

    logout(): Observable<any> {
        return this.httpClient.post<any>(
            `/logout`,
            {},
            {
                withCredentials: true,
            }
        );
    }
}
