import { Injectable, signal } from '@angular/core'
import { Encodable, IdentitySerializer, JsonSerializer, RSocketClient } from 'rsocket-core'
import { ReactiveSocket } from 'rsocket-types'
import RSocketWebSocketClient from 'rsocket-websocket-client'
import { AuthService } from 'src/app/auth/service/auth.service'
import { SnackbarService } from 'src/app/core/service/snack-bar.service'
import { TickerMessage } from '../model/ticker-message'
import { TickerSubscriptionMessageDTO } from '../model/ticker-subscription-message'

@Injectable()
export class TickerWebsocketService {
  public $messageReceived = signal<TickerMessage | null>(null)

  private _client: RSocketClient<unknown, Encodable>
  private _socket: ReactiveSocket<unknown, Encodable> | undefined
  private _userId: string | null

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

  public sendMessage(message: TickerSubscriptionMessageDTO): void {
    console.log('sending subscription message:' + message)
    if (!this._socket) {
      return
    }
    this._socket.requestStream({
      data: message,
      metadata: String.fromCharCode('ticker-sub'.length) + 'ticker-sub'
    })
  }

  private connectWithSocket(): void {
    this._client.connect().subscribe({
      onComplete: (socket) => {
        this._socket = socket
        this.sendSubscriptionRequest(socket)
      },
      onError: (error) => {
        console.log('Connection has been refused due to:: ' + error)
        this._snackBarService.error('Failed to connect to get ticker prices')
      }
    })
  }

  private initRSocketClient(): RSocketClient<unknown, Encodable> {
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

  private sendSubscriptionRequest(socket: ReactiveSocket<unknown, Encodable>): void {
    socket
      .requestStream({
        data: { symbols: [], userId: this._userId },
        metadata: String.fromCharCode('ticker-sub'.length) + 'ticker-sub'
      })
      .subscribe({
        onNext: (payload) => {
          console.log(payload)
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

  private emitMessage(newMessage: TickerMessage): void {
    console.log('received message:' + JSON.stringify(newMessage))
    this.$messageReceived.set(newMessage)
  }
}
