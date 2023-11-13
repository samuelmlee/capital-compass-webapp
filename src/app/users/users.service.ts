import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {
  public constructor (private readonly http: HttpClient) {}

  public getUserProfile (): Observable<any> {
    return this.http.get('/users')
  }
}
