import { Injectable, Signal, computed, signal } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _$loadingMap = signal(new Map<string, boolean>())

  public setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function')
    }
    if (loading === true) {
      this._$loadingMap.update((map) => map.set(url, loading))
    } else if (loading === false && this._$loadingMap().has(url)) {
      this._$loadingMap.update((map) => {
        map.delete(url)
        return map
      })
    }
    // if (this._$loadingMap().size === 0) {
    //   this.$loading.set(false)
    // }
  }

  public getLoadingSignal(url: string): Signal<boolean | undefined> {
    return computed(() => this._$loadingMap().get(url))
  }
}
