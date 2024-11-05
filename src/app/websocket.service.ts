import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: Socket;
  private socketIdWritable = signal('');
  public socketId = this.socketIdWritable.asReadonly();
  
  constructor() {
    this.createConnection();
  }

  createConnection() {
    // Conectar ao servidor Socket.IO
    console.log('url: ', environment.apiURL);
    this.socket = io(`${environment.apiURL}`, {
      path: "/my-custom-path/",
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      this.socketIdWritable.set(this.socket.id ?? '')
    });
  }

  // Enviar mensagem para o servidor
  sendMessage(dataMessage: any) {
    this.socket.emit('message', dataMessage);
  }

  // Receber mensagens do servidor
  onMessage(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('message', (dataMessage) => {
        console.log('dataMessage: ', dataMessage);
        observer.next(dataMessage);
      })
    })
  }
}
