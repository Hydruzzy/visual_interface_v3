import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from './chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getChatMessages().subscribe(messages => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 100); // Scroll kurz nach Laden
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Scroll fehlgeschlagen:', err);
    }
  }

  public getClass(author: string): string {
    const key = author.trim().toLowerCase();
    switch (key) {
      case 'tom': return 'message player-tom';
      case 'helena': return 'message player-helena';
      case 'kyve': return 'message player-kyve';
      case 'max': return 'message player-max';
      case 'system': return 'message system';
      default: return 'message';
    }
  }
}
