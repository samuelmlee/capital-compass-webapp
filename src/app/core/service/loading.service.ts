import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loadingMap = new Map<string, BehaviorSubject<boolean>>()

  public setLoading(loading: boolean, url: string): void {
    if (!url) {
      return
    }
    if (this._loadingMap.has(url)) {
      this._loadingMap.get(url)?.next(loading)
    }
  }

  public isLoading(url: string): Observable<boolean> {
    if (!this._loadingMap.has(url)) {
      this._loadingMap.set(url, new BehaviorSubject(false))
    }
    return this._loadingMap.get(url)!.asObservable()
  }
}
