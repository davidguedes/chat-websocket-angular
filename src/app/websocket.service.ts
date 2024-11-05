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
    // Conectar ao servidor Socket.IO ${environment.apiURL}
    this.socket = io(`https://ws-chat-websocket.vercel.app`, {
      withCredentials: true,
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

  sendPrivateMessage(dataMessage: any) {
    this.socket.emit('private_message', dataMessage);
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

  // Enviar nome do novo usuário para o servidor
  sendNewUser(name: string) {
    this.socket.emit('new_user_name', name);
  }

  onNewUser(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('new_user_name', (user) => {
        console.log('user', user);
        observer.next(user);
      });
    });
  }
}
