import { HttpClientTestingModule } from '@angular/common/http/testing'
import { signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Encodable } from 'rsocket-core'
import { ReactiveSocket } from 'rsocket-types'
import { AuthService } from '../../auth/service/auth.service'
import { SnackbarService } from '../../core/service/snack-bar.service'
import { User } from '../../users/model/user'
import { Result } from '../model/result'
import { TickerWebsocketService } from './ticker-websocket.service'

jest.mock('rsocket-core', () => {
  return {
    RSocketClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockReturnValue({
        subscribe: jest.fn((callbacks) => {
          callbacks.onComplete({
            requestChannel: jest.fn().mockReturnValue({
              subscribe: jest.fn()
            })
          } as Partial<ReactiveSocket<unknown, Encodable>>)
        })
      }),
      close: jest.fn()
    }))
  }
})

describe('TickerWebsocketService', () => {
  let service: TickerWebsocketService

  const mockAuthService = {
    userResult(): Result<Partial<User>> {
      return { value: signal<Partial<User>>({ username: 'user1' }), error: signal(null) }
    }
  }
  const mockSnackbarService = { error: jest.fn(), success: jest.fn() }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TickerWebsocketService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: SnackbarService, useValue: mockSnackbarService }
      ]
    })
    service = TestBed.inject(TickerWebsocketService)
  })

  it('should initialize RSocketClient and connect', () => {
    expect(service['_client'].connect).toHaveBeenCalledTimes(1)
  })

  it('should close the RSocketClient on ngOnDestroy', () => {
    service.ngOnDestroy()
    expect(service['_client'].close).toHaveBeenCalledTimes(1)
  })

  it('should send subscription message correctly', () => {
    const nextSpy = jest.spyOn(service['_subscriptionMessagesSub'], 'next')

    const tickerSymbols = ['AAPL', 'GOOGL']
    service.sendSubscriptionMessage(tickerSymbols)

    expect(nextSpy).toHaveBeenCalledWith({
      symbols: tickerSymbols,
      userId: 'user1'
    })

    nextSpy.mockReset()
  })

  it('should not update sendSubscriptionMessage if no userId is available', () => {
    jest.spyOn(mockAuthService, 'userResult').mockImplementation(() => ({
      value: signal<Partial<User>>({ username: undefined }),
      error: signal(null)
    }))

    TestBed.overrideProvider(AuthService, { useValue: mockAuthService })
    service = TestBed.inject(TickerWebsocketService)

    const nextSpy = jest.spyOn(service['_subscriptionMessagesSub'], 'next')

    const tickerSymbols = ['AAPL', 'GOOGL']
    service.sendSubscriptionMessage(tickerSymbols)

    expect(nextSpy).not.toHaveBeenCalled()

    nextSpy.mockReset()
  })
})
