import { Injectable } from '@angular/core'
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  public error(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, undefined, { panelClass: ['snackbar-error'] })
  }

  public success(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, undefined, { panelClass: ['snackbar-success'] })
  }

  public info(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, undefined, { panelClass: ['snackbar-info'] })
  }
}
