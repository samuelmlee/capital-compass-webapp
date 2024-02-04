import { Injectable } from '@angular/core'
import { IdentitySerializer, JsonSerializer, RSocket, RSocketClient } from 'rsocket-core'
import { RSocketWebSocketClient } from 'rsocket-websocket-client'

import { Subject } from 'rxjs'

@Injectable()
export class TickerWebsocketService {
  private client: RSocketClient
  private sub = new Subject()

  constructor() {
    this.client = new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer
      },
      setup: {
        // ms btw sending keepalive to server
        keepAlive: 60000,
        // ms timeout if no keepalive response
        lifetime: 180000,
        // format of `data`
        dataMimeType: 'application/json',
        // format of `metadata`
        metadataMimeType: 'message/x.rsocket.routing.v0'
      },
      transport: new RSocketWebSocketClient({
        url: 'wss://localhost:8443/rsocket'
      })
    })
    // Open the connection
    this.client.connect().subscribe({
      onComplete: (socket: RSocket) => {
        // socket provides the rsocket interactions fire/forget, request/response,
        // request/stream, etc as well as methods to close the socket.
        socket
          .requestStream({
            data: null, // null is a must if it does not include a message payload, else the Spring server side will not be matched.
            metadata: String.fromCharCode('messages'.length) + 'messages'
          })
          .subscribe({
            onComplete: () => console.log('complete'),
            onError: (error) => {
              console.log('Connection has been closed due to:: ' + error)
            },
            onNext: (payload) => {
              console.log(payload)
              this.addMessage(payload.data)
            },
            onSubscribe: (subscription) => {
              subscription.request(1000000)
            }
          })
        this.sub.subscribe({
          next: (data) => {
            socket.fireAndForget({
              data: data,
              metadata: String.fromCharCode('send'.length) + 'send'
            })
          }
        })
      },
      onError: (error) => {
        console.log('Connection has been refused due to:: ' + error)
      },
      onSubscribe: (cancel) => {
        /* call cancel() to abort */
      }
    })
  }
}
