import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: {
    author: string;
    text?: string;
    image?: string;
    type: 'text' | 'image' | 'image-list';
    time?: number;
    images?: string[];
  }[] = [];

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

        // Füge Textnachricht hinzu
        this.messages.push({
          author: msg.agentName,
          text: msg.message,
          type: 'text',
          time: msg.time
        });

        // Füge Policy-Bilder nur bei GameMaster ein
        if (msg.agentName?.toLowerCase() === 'gamemaster') {
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
        }

        // Füge Voting-Bilder ein, wenn Voting erkannt wird
        if (msg.agentName?.toLowerCase() === 'gamemaster' && lowerMsg.includes('result of voting for')) {
          const yesMatch = msg.message.match(/yes:\s*(\d+)/i);
          const noMatch = msg.message.match(/no:\s*(\d+)/i);
          const yesVotes = yesMatch ? parseInt(yesMatch[1], 10) : 0;
          const noVotes = noMatch ? parseInt(noMatch[1], 10) : 0;

          const images = [
            ...Array(yesVotes).fill('assets/voting_ja.png'),
            ...Array(noVotes).fill('assets/voting_nein.png')
          ];

          this.messages.push({
            author: 'system',
            type: 'image-list',
            images,
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
