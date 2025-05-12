import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: { author: string, text: string }[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getMessages().subscribe((data: any[]) => {
      this.messages = data.map((msg: any) => ({
        author: msg.agentName,
        text: msg.message
      }));
    });
  }

  getClass(author: string): string {
    return author === 'system' ? 'system-message' : 'player-message';
  }
}
