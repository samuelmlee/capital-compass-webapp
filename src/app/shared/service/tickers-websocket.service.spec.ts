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
    userResult: { value: signal<Partial<User>>({ username: 'user1' }) }
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
    expect(service['_client'].connect).toHaveBeenCalled()
  })
})
