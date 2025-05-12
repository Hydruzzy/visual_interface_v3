import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: { author: string, text: string }[] = [];
  gameIds: string[] = [];
  selectedGameId: string = '';

  // Dynamische Farbzuteilung pro Agent
  agentColors: Map<string, string> = new Map();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    // Game-IDs laden
    this.gameService.getGameList().subscribe((games: any[]) => {
      this.gameIds = games.map(g => g._id);
    });
  }

  // Wenn ein Spiel ausgewählt wurde → Nachrichten laden
  onGameSelected(): void {
    this.gameService.getMessagesByGameId(this.selectedGameId).subscribe((data: any[]) => {
      this.messages = data.map((msg: any) => ({
        author: msg.agentName,
        text: msg.message
      }));
    });
  }

  // Farbwert aus Namens-Hash berechnen
  private generateColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360); // Sicherheitshalber positiv
    return `hsl(${hue}, 60%, 75%)`; // Pastellfarbe
  }

  // Farbe für AgentName abrufen (oder neu berechnen)
  getColor(name: string): string {
    if (!this.agentColors.has(name)) {
      this.agentColors.set(name, this.generateColor(name));
    }
    return this.agentColors.get(name)!;
  }
}
