import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  author: string;
  text?: string;
  image?: string;
  type: 'text' | 'image';
  time?: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  gameIds: string[] = [];
  selectedGameId: string = '';
  agentColors: Map<string, string> = new Map();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getGameList().subscribe((games: any[]) => {
      this.gameIds = games.map(g => g._id);
    });
  }

  onGameSelected(): void {
    this.messages = [];

    this.gameService.getMessagesByGameId(this.selectedGameId).subscribe((data: any[]) => {
      data.forEach((msg: any) => {
        const lowerMsg = msg.message.toLowerCase();

        // Textnachricht hinzufügen
        this.messages.push({
          author: msg.agentName,
          text: msg.message,
          time: msg.time,
          type: 'text'
        });

        // Bildnachricht bei bestimmten Schlüsselwörtern
        if (lowerMsg.includes('policy liberal')) {
          this.messages.push({
            author: 'system',
            image: 'assets/policy_liberal.png',
            type: 'image',
            time: msg.time
          });
        }

        if (lowerMsg.includes('policy fascist')) {
          this.messages.push({
            author: 'system',
            image: 'assets/policy_fascist.png',
            type: 'image',
            time: msg.time
          });
        }
      });
    });
  }

  private generateColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 60%, 75%)`;
  }

  getColor(name: string): string {
    if (!this.agentColors.has(name)) {
      this.agentColors.set(name, this.generateColor(name));
    }
    return this.agentColors.get(name)!;
  }
}
