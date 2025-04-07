import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from './chat.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];

  thoughts: { author: string, text: string }[] = [];

  players = [
    { name: 'Tom', class: 'player-tom' },
    { name: 'Helena', class: 'player-helena' },
    { name: 'Kyve', class: 'player-kyve' },
    { name: 'Max', class: 'player-max' }
  ];

  constructor(private chatService: ChatService, private http: HttpClient) {}

  ngOnInit(): void {
    this.chatService.getChatMessages().subscribe(messages => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 100);
    });

    this.loadThoughts('Tom');
    this.loadThoughts('Helena');
    this.loadThoughts('Kyve');
    this.loadThoughts('Max');
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

  private loadThoughts(name: string): void {
    this.http.get(`/thoughts_${name}.txt`, { responseType: 'text' })
      .subscribe(text => {
        this.thoughts.push({ author: name, text });
      });
  }
}
