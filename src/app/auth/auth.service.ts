import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../users/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private httpClient: HttpClient,
        private httpXsrfTokenExtractor: HttpXsrfTokenExtractor
    ) {}

    private apiUrl: string = environment.apiUrl;

    authenticate(): Observable<User> {
        return this.httpClient.get<User>(`${this.apiUrl}/user`, {
            withCredentials: true,
        });
    }

    login(): void {
        window.open(`${this.apiUrl}/oauth2/authorization/okta`, '_self');
    }

    logout(): Observable<any> {
        const formData: any = new FormData();
        formData.append('_csrf', this.httpXsrfTokenExtractor.getToken());
        return this.httpClient.post<any>(`${this.apiUrl}/logout`, formData);
    }
}
