import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, switchMap } from 'rxjs'
import { Result } from 'src/app/shared/model/result'
import { environment } from '../../../environments/environment'
import { ErrorHandlingService } from '../../core/service/error-handling.service'
import { fromObsToSignal } from '../../shared/utils/from-obs-to-signal'
import { AdminUserDTO } from '../model/admin-user'

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  public adminUsersResult: Result<AdminUserDTO[]>

  private _getAdminUsersSubject = new Subject<void>()

  private _apiUrl = environment.apiUrl

  constructor(
    private _http: HttpClient,
    private _errorHandlingService: ErrorHandlingService
  ) {
    this.adminUsersResult = fromObsToSignal<AdminUserDTO[]>(
      this._getAdminUsersSubject.pipe(switchMap(() => this.getAdminUsers())),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'Users for Admin')
    )
  }

  public fetchAdminUsers(): void {
    this._getAdminUsersSubject.next()
  }

  private getAdminUsers(): Observable<AdminUserDTO[]> {
    return this._http.get<AdminUserDTO[]>(`${this._apiUrl}/users/admin-users`, {
      withCredentials: true
    })
  }
}
