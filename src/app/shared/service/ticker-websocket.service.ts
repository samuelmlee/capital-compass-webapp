import { Injectable, signal } from '@angular/core'
import { Encodable, IdentitySerializer, JsonSerializer, RSocketClient } from 'rsocket-core'
import { Flowable } from 'rsocket-flowable'
import { Payload, ReactiveSocket } from 'rsocket-types'
import RSocketWebSocketClient from 'rsocket-websocket-client'
import { Subject } from 'rxjs'
import { AuthService } from 'src/app/auth/service/auth.service'
import { SnackbarService } from 'src/app/core/service/snack-bar.service'
import { TickerMessage } from '../model/ticker-message'
import { TickerSubscriptionMessageDTO } from '../model/ticker-subscription-message'

@Injectable()
export class TickerWebsocketService {
  public $tickerMessage = signal<TickerMessage | null>(null)

  private _client: RSocketClient<TickerSubscriptionMessageDTO, Encodable>
  private _subscriptionMessagesSub = new Subject<TickerSubscriptionMessageDTO>()
  private _userId: string | null
  private _tickerSubEndpoint = 'ticker-sub'

  constructor(
    private _authService: AuthService,
    private _snackBarService: SnackbarService
  ) {
    this._userId = this._authService.userResult.value()?.username ?? null
    this._client = this.initRSocketClient()

    this.connectWithSocket()
  }

  public ngOnDestroy(): void {
    if (this._client) {
      this._client.close()
    }
  }

  public sendSubscriptionMessage(tickerSymbols: string[]): void {
    if (!this._userId) {
      console.log('User id not defined to send TickerSubscriptionMessageDTO')
    }

    const subscriptionMessage: TickerSubscriptionMessageDTO = {
      symbols: [...new Set(tickerSymbols)],
      userId: this._userId!
    }

    this._subscriptionMessagesSub.next(subscriptionMessage)
  }

  private initRSocketClient(): RSocketClient<TickerSubscriptionMessageDTO, Encodable> {
    return new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer
      },
      setup: {
        keepAlive: 60000,
        lifetime: 180000,
        dataMimeType: 'application/json',
        metadataMimeType: 'message/x.rsocket.routing.v0'
      },
      transport: new RSocketWebSocketClient({
        url: 'wss://localhost:8443/rsocket'
      })
    })
  }

  private connectWithSocket(): void {
    this._client.connect().subscribe({
      onComplete: (socket) => {
        this.openTickerMessagesChannel(socket)
      },
      onError: (error) => {
        console.log('Connection has been refused due to: ' + error)
        this._snackBarService.error('Failed to connect to get ticker prices')
      }
    })
  }

  private openTickerMessagesChannel(socket: ReactiveSocket<unknown, Encodable>): void {
    if (!socket) {
      console.log('No socket available to send message')
      return
    }
    socket
      .requestChannel(this.fromSubjectToFlowable(this._subscriptionMessagesSub))

      .subscribe({
        onNext: (payload) => {
          this.emitMessage(payload.data as TickerMessage)
        },
        onError: (error) => {
          console.log('Connection has been closed due to:: ' + error)
          this._snackBarService.error('Error getting ticker prices')
        },
        onComplete: () => console.log('complete'),
        onSubscribe: (subscription) => {
          subscription.request(1000000)
        }
      })
  }

  private fromSubjectToFlowable(
    subject: Subject<TickerSubscriptionMessageDTO>
  ): Flowable<Payload<unknown, Encodable>> {
    return new Flowable((subscriber) => {
      const subscription = subject.subscribe({
        next: (value) => {
          subscriber.onNext({
            data: value,
            metadata: String.fromCharCode(this._tickerSubEndpoint.length) + this._tickerSubEndpoint
          })
        },
        error: (error) => subscriber.onError(error),
        complete: () => subscriber.onComplete()
      })

      subscriber.onSubscribe({
        cancel: () => {
          subscription.unsubscribe()
        },
        request: (n) => {}
      })
    })
  }

  private emitMessage(newMessage: TickerMessage): void {
    this.$tickerMessage.set(newMessage)
  }
}
