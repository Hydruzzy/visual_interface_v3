import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // 👈 Nur RouterOutlet nötig
import { ChatComponent } from './chat/chat.component'; // Kann weg, wird über Routing geladen

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet // 👈 das reicht für Routing
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {}

  players = [
    { name: 'Tom', class: 'player-tom' },
    { name: 'Helena', class: 'player-helena' },
    { name: 'Kyve', class: 'player-kyve' },
    { name: 'Max', class: 'player-max' }
  ];

  goToThoughts(name: string) {
    this.router.navigate(['/thoughts', name.toLowerCase()]);
  }
}
