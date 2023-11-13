import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersServiceService {
    constructor(private http: HttpClient) {}

    getUserProfile(): Observable<any> {
        return this.http.get(`/users`);
    }
}
