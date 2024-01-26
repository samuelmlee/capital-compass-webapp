import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar'
import { SnackbarService } from './snack-bar.service'

describe('SnackbarService', () => {
  let service: SnackbarService
  let snackBarMock: Partial<MatSnackBar>

  beforeEach(() => {
    snackBarMock = {
      open: jest.fn().mockReturnValue({} as MatSnackBarRef<TextOnlySnackBar>)
    }

    service = new SnackbarService(snackBarMock as MatSnackBar)
  })

  it('should display an error snackbar', () => {
    const message = 'Test error message'
    service.error(message)

    expect(snackBarMock.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 10000,
      panelClass: ['error-snackbar']
    })
  })

  it('should display a success snackbar', () => {
    const message = 'Test success message'
    service.success(message)

    expect(snackBarMock.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 10000,
      panelClass: ['success-snackbar']
    })
  })

  it('should display an info snackbar', () => {
    const message = 'Test info message'
    service.info(message)

    expect(snackBarMock.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 10000,
      panelClass: ['info-snackbar']
    })
  })
})
