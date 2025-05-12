import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { FormsModule } from '@angular/forms';

type MessageType = 'text' | 'image' | 'voting';

interface ChatMessage {
  author: string;
  text?: string;
  image?: string;
  votes?: string[];
  type: MessageType;
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

        // Standard Textnachricht
        this.messages.push({
          author: msg.agentName,
          text: msg.message,
          type: 'text',
          time: msg.time
        });

        // Policy-Bilder
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

        // Voting-Ergebnisse (Mehrfachbilder)
        if (lowerMsg.includes('result of voting for')) {
          const yesMatch = msg.message.match(/yes:\s*(\d+)/i);
          const noMatch = msg.message.match(/no:\s*(\d+)/i);
          const yesCount = yesMatch ? parseInt(yesMatch[1], 10) : 0;
          const noCount = noMatch ? parseInt(noMatch[1], 10) : 0;

          const voteImages = [
            ...Array(yesCount).fill('assets/voting_ja.png'),
            ...Array(noCount).fill('assets/voting_nein.png'),
          ];

          this.messages.push({
            author: 'system',
            votes: voteImages,
            type: 'voting',
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
