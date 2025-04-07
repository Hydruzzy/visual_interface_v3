import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ThoughtsComponent } from './thoughts/thoughts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent, ThoughtsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  players = [
    { name: 'Tom', class: 'player-tom' },
    { name: 'Helena', class: 'player-helena' },
    { name: 'Kyve', class: 'player-kyve' },
    { name: 'Max', class: 'player-max' }
  ];
}


