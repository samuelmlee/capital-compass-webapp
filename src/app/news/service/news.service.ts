import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, switchMap } from 'rxjs'
import { ErrorHandlingService } from 'src/app/core/service/error-handling.service'
import { Result } from 'src/app/shared/model/result'
import { fromObsToSignal } from 'src/app/shared/utils/fromObsToSignal'
import { environment } from 'src/environments/environment'
import { NewsResponse } from '../model/news-response'

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  public newsResult: Result<NewsResponse>

  private _newsSubject = new Subject<string>()

  private _apiUrl = environment.apiUrl

  constructor(
    private _http: HttpClient,
    private _errorHandlingService: ErrorHandlingService
  ) {
    this.newsResult = fromObsToSignal<NewsResponse>(
      this._newsSubject.pipe(switchMap((tickerSymbol) => this.getNewsByTickerSymbol(tickerSymbol))),
      (e: HttpErrorResponse) => this._errorHandlingService.getErrorMessage(e, 'News')
    )
  }

  public fetchNewsByTickerSymbol(tickerSymbol: string): void {
    this._newsSubject.next(tickerSymbol)
  }

  private getNewsByTickerSymbol(tickerSymbol: string): Observable<NewsResponse> {
    const options = tickerSymbol ? { params: new HttpParams().set('ticker', tickerSymbol) } : {}

    return this._http.get<NewsResponse>(`${this._apiUrl}/stocks/reference/tickers/news`, options)
  }
}
