import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UsersServiceService {
    private apiUrl = environment.apiGatewayUrl;

    constructor(private http: HttpClient) {}

    getUserProfile(): Observable<any> {
        let hdr = new HttpHeaders();
        // Request to users micro service

        return this.http.get(`${this.apiUrl}/`, { headers: hdr });
    }
}
