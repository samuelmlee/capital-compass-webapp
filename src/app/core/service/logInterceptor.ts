import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'

@Injectable()
export class HttpInterceptorImpl implements HttpInterceptor {
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: unknown) => {
          console.log('Error occured for HTTP request : ', err)
        }
      )
    )
  }
}
