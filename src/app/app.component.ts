import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './websocket.service';
import { FormsModule } from '@angular/forms';

interface messageChat {
  mensagem: string;
  name_user: string;
  new_user: boolean;
  from_me: boolean;
  user_id: string;
  id_message: string;
  private?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'chat-websocket-angular';
  name: string = '';
  newMessage: string = '';
  messages: messageChat[] = [];

  protected websocketService = inject(WebsocketService);

  ngOnInit(): void {
    this.websocketService.onMessage().subscribe((dataMessage: any) => {
      let dataAtual = new Date();
      this.messages.push({
        mensagem: dataMessage.msg,
        name_user: dataMessage.user,
        new_user: false,
        from_me: dataMessage.user_id == this.websocketService.socketId() ? true : false,
        user_id: dataMessage.user,
        id_message: `${dataAtual.getTime}${dataMessage.user}`,
        private: dataMessage.private ?? false
      })
    })
  }

  // Enviar mensagem
  sendMessage() {
    if(this.newMessage.trim()) {
      this.websocketService.sendMessage({
        message: this.newMessage,
        user: this.name,
        user_id: this.websocketService.socketId()
      })
      this.newMessage = '';
    }
  }
}
