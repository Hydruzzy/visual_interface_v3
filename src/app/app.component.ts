import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ThoughtsComponent } from './thoughts/thoughts.component';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent, ThoughtsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  players: any[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getMessages().subscribe((messages: any[]) => {
      const uniqueNames = [...new Set(messages.map(m => m.agentName))];
      this.players = uniqueNames.map(name => ({
        name,
        class: 'player-' + name.toLowerCase()
      }));
    });
  }
}
