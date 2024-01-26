import { LoadingService } from './loading.service'

describe('LoadingService', () => {
  let service: LoadingService

  beforeEach(() => {
    service = new LoadingService()
  })

  it('should fetch the correct loading state for a URL', () => {
    const testUrl = 'http://test-url.com'

    service.isLoading(testUrl).subscribe((state) => {
      expect(state).toBe(false)
    })

    service.setLoading(true, testUrl)

    service.isLoading(testUrl).subscribe((state) => {
      expect(state).toBe(true)
    })
  })

  it('should create a new loading state for a new URL', () => {
    const newUrl = 'http://new-url.com'

    service.isLoading(newUrl).subscribe((state) => {
      expect(state).toBe(false)
    })

    expect(service['_loadingMap'].has(newUrl)).toBe(true)
  })
})
