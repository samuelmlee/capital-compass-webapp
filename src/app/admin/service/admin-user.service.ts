import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, switchMap } from 'rxjs'
import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { AdminUserDTO } from '../model/admin-user'

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  public adminUsersSignal: Result<AdminUserDTO[]>

  private _getAdminUsersSubject = new Subject<void>()

  private _apiUrl = environment.apiUrl

  constructor(private _http: HttpClient) {
    this.adminUsersSignal = fromObsToSignal<AdminUserDTO[]>(
      this._getAdminUsersSubject.pipe(switchMap(() => this.getAdminUsers()))
    )
  }

  public fetchAdminUsers(): void {
    this._getAdminUsersSubject.next()
  }

  private getAdminUsers(): Observable<AdminUserDTO[]> {
    return this._http.get<AdminUserDTO[]>(`${this._apiUrl}/admin/users`, {
      withCredentials: true
    })
  }
}
