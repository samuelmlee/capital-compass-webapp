import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'

@Injectable()
export class HttpInterceptorImpl implements HttpInterceptor {
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: HttpErrorResponse) => {
          console.error(`Request to ${request.urlWithParams} failed: `, err.message)
        }
      )
    )
  }
}
