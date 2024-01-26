import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  public getErrorMessage(error: HttpErrorResponse, resource: string): string {
    switch (error.status) {
      case 400:
        return `Bad Request when accessing ${resource}.`
      case 401:
        return `Unauthorized access to ${resource}. Please login.`
      case 403:
        return `Forbidden access to ${resource}.`
      case 404:
        return `${resource} for User not found.`
      case 500:
        return `Server error occurred for ${resource}.`
      default:
        return `An unexpected error occurred.`
    }
  }
}
