import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message',
  imports: [CommonModule],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class Message {
  messageService: MessageService = inject(MessageService);
}
