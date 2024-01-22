import { Injectable } from '@angular/core'
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  public error(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, 'Close', {
      duration: 10000,
      panelClass: ['error-snackbar']
    })
  }

  public success(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, 'Close', {
      duration: 10000,
      panelClass: ['success-snackbar']
    })
  }

  public info(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, 'Close', {
      duration: 10000,
      panelClass: ['info-snackbar']
    })
  }
}
