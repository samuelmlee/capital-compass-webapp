import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router'

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private _routeStore = new Map<string, DetachedRouteHandle>()
  private _currentRoute: ActivatedRouteSnapshot | undefined

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path
    if (!path) {
      return false
    }
    const isSearchRoute = path === 'search'

    const navigatingToDetails = this._currentRoute?.routeConfig?.path === 'ticker-details/:ticker'

    if (isSearchRoute && navigatingToDetails) {
      return true
    }
    return false
  }

  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = route.routeConfig?.path
    if (!path) {
      return
    }
    this._routeStore.set(path, handle)
  }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path
    if (!path) {
      return false
    }
    return ['search'].includes(path) && !!this._routeStore.get(path)
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = route.routeConfig?.path
    if (!path) {
      return null
    }
    const routeHandle = this._routeStore.get(path)
    if (!routeHandle) {
      return null
    }
    return routeHandle
  }

  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    this._currentRoute = future
    return future.routeConfig === curr.routeConfig
  }
}
