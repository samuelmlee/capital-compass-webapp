import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loadingMap = new Map<string, boolean>()

  private _loadingSub = new BehaviorSubject<boolean>(false)

  public loading$ = this._loadingSub.asObservable()

  public setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function')
    }
    if (loading === true) {
      this._loadingMap.set(url, loading)
      this._loadingSub.next(true)
    } else if (loading === false && this._loadingMap.has(url)) {
      this._loadingMap.delete(url)
    }
    if (this._loadingMap.size === 0) {
      this._loadingSub.next(false)
    }
  }
}
