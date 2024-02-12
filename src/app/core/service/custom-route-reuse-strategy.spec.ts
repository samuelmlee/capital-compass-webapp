import { ActivatedRouteSnapshot, DetachedRouteHandle, Route } from '@angular/router'
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy'

describe('CustomRouteReuseStrategy', () => {
  let customRouteReuseStrategy: CustomRouteReuseStrategy

  beforeEach(() => {
    customRouteReuseStrategy = new CustomRouteReuseStrategy()
  })

  describe('shouldDetach', () => {
    it('should return false if route config path is not defined', () => {
      const route = { routeConfig: null } as ActivatedRouteSnapshot
      expect(customRouteReuseStrategy.shouldDetach(route)).toBe(false)
    })

    it('should return true if navigating from search to ticker-details', () => {
      customRouteReuseStrategy['_futureRoute'] = {
        routeConfig: { path: 'ticker-details/:ticker' }
      } as ActivatedRouteSnapshot
      const route = { routeConfig: { path: 'search' } } as ActivatedRouteSnapshot
      expect(customRouteReuseStrategy.shouldDetach(route)).toBe(true)
    })

    it('should return false if not navigating from search to ticker-details', () => {
      customRouteReuseStrategy['_futureRoute'] = {
        routeConfig: { path: 'another-path' }
      } as ActivatedRouteSnapshot
      const route = { routeConfig: { path: 'search' } } as ActivatedRouteSnapshot
      expect(customRouteReuseStrategy.shouldDetach(route)).toBe(false)
    })
  })

  describe('store', () => {
    it('should store the handle for the given route', () => {
      const route = { routeConfig: { path: 'path-to-store' } } as ActivatedRouteSnapshot
      const handle = {} as DetachedRouteHandle
      customRouteReuseStrategy.store(route, handle)

      expect(customRouteReuseStrategy['_routeStore'].get('path-to-store')).toBe(handle)
    })

    it('should not store the handle if route config path is not defined', () => {
      const route = { routeConfig: null } as ActivatedRouteSnapshot
      const handle = {} as DetachedRouteHandle
      customRouteReuseStrategy.store(route, handle)

      expect(customRouteReuseStrategy['_routeStore']).toEqual(new Map())
    })
  })

  describe('shouldAttach', () => {
    it('should return true if a handle exists for the route', () => {
      customRouteReuseStrategy['_routeStore'].set('search', {} as DetachedRouteHandle)
      const route = { routeConfig: { path: 'search' } } as ActivatedRouteSnapshot

      expect(customRouteReuseStrategy.shouldAttach(route)).toBe(true)
    })

    it('should return false if no handle exists for the route', () => {
      const route = { routeConfig: { path: 'search' } } as ActivatedRouteSnapshot
      expect(customRouteReuseStrategy.shouldAttach(route)).toBe(false)
    })
  })

  describe('retrieve', () => {
    it('should return null if route config path is not defined', () => {
      const route = { routeConfig: null } as ActivatedRouteSnapshot
      expect(customRouteReuseStrategy.retrieve(route)).toBeNull()
    })

    it('should return null if no handle is stored for the route', () => {
      const route = { routeConfig: { path: 'non-saved-path' } } as ActivatedRouteSnapshot
      expect(customRouteReuseStrategy.retrieve(route)).toBeNull()
    })

    it('should return stored handle for the route', () => {
      const path = 'test-path'
      const route = { routeConfig: { path } } as ActivatedRouteSnapshot
      const handle = {} as DetachedRouteHandle
      customRouteReuseStrategy['_routeStore'].set(path, handle)

      expect(customRouteReuseStrategy.retrieve(route)).toBe(handle)
    })
  })

  describe('shouldReuseRoute', () => {
    it('should update futureRoute and return true if future and current route configs are the same', () => {
      const sameRoute: Route = { path: 'test-path' }
      const futureRoute = { routeConfig: sameRoute } as ActivatedRouteSnapshot
      const currRoute = { routeConfig: sameRoute } as ActivatedRouteSnapshot

      const result = customRouteReuseStrategy.shouldReuseRoute(futureRoute, currRoute)

      expect(result).toBe(true)
      expect(customRouteReuseStrategy['_futureRoute']).toBe(futureRoute)
    })

    it('should update futureRoute and return false if future and current route configs are different', () => {
      const futureRoute = { routeConfig: { path: 'different-path' } } as ActivatedRouteSnapshot
      const currRoute = { routeConfig: { path: 'test-path' } } as ActivatedRouteSnapshot

      const result = customRouteReuseStrategy.shouldReuseRoute(futureRoute, currRoute)

      expect(result).toBe(false)
      expect(customRouteReuseStrategy['_futureRoute']).toBe(futureRoute)
    })
  })
})
