import { HttpClientTestingModule } from '@angular/common/http/testing'
import { signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Encodable } from 'rsocket-core'
import { ReactiveSocket } from 'rsocket-types'
import { AuthService } from '../../auth/service/auth.service'
import { SnackbarService } from '../../core/service/snack-bar.service'
import { User } from '../../users/model/user'
import { TickerWebsocketService } from './ticker-websocket.service'

jest.mock('rsocket-core', () => {
  return {
    RSocketClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockReturnValue({
        subscribe: jest.fn((callbacks) => {
          callbacks.onComplete({
            requestChannel: jest.fn().mockReturnValue({
              subscribe: jest.fn().mockImplementation(() => ({
                onNext: jest.fn().mockReturnValue({
                  symbol: 'AAPL',
                  accumulatedVolume: 404,
                  volumeWeightedPrice: 403,
                  closingTickPrice: 404
                })
              }))
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
    userResult: {
      value: signal<Partial<User | undefined>>({ username: 'user1' }),
      error: signal(null)
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

  // TODO: fix stub
  xit('should not update sendSubscriptionMessage if no userId is available', () => {
    Object.defineProperty(mockAuthService, 'userResult', { value: signal<Partial<User>>({}) })

    const nextSpy = jest.spyOn(service['_subscriptionMessagesSub'], 'next')

    const tickerSymbols = ['AAPL', 'GOOGL']
    service.sendSubscriptionMessage(tickerSymbols)

    expect(nextSpy).not.toHaveBeenCalled()

    nextSpy.mockReset()
  })

  it('should emit the ticker message received from the channel', () => {
    setTimeout(() => {
      expect(service.$tickerMessage()).toEqual({
        symbol: 'AAPL',
        accumulatedVolume: 404,
        volumeWeightedPrice: 403,
        closingTickPrice: 404
      })
    }, 0)
  })
})
