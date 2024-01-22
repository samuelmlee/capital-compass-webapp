import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, tap } from 'rxjs'
import { LoadingService } from './loading.service'

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private _loading: LoadingService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this._loading.setLoading(true, request.url)
    return next.handle(request).pipe(
      catchError((err) => {
        this._loading.setLoading(false, request.url)
        throw err
      }),
      tap((event) => {
        if (event instanceof HttpResponse) {
          this._loading.setLoading(false, request.url)
        }
      })
    )
  }
}
