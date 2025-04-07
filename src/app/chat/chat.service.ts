import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ChatMessage {
  author: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatMessages(): Observable<ChatMessage[]> {
    return this.http.get('/SimulationProtocol.txt', { responseType: 'text' }).pipe(
      map(data => {
        const lines = data.split('\n').map(line => line.trim()).filter(line => line);
        const messages: ChatMessage[] = [];
      
        let currentAuthor: string | null = null;
      
        for (const line of lines) {
          if (line === '---') {
            currentAuthor = null; // Nur --- unterdrücken
            continue;
          }
          if (line.startsWith('Result') || line.includes('voted')) {
            messages.push({ author: 'system', text: line });
            currentAuthor = null;
            continue;
          }
          
      
          if (line.includes(':') && !line.startsWith(' ')) {
            const [authorRaw, ...rest] = line.split(':');
            currentAuthor = authorRaw.trim();
            const text = rest.join(':').trim();
            messages.push({ author: currentAuthor, text });
          } else if (currentAuthor) {
            messages.push({ author: currentAuthor, text: line });
          } else {
            // Sicherheits-Backup, falls Zeile ohne Author und kein aktiver Sprecher
            messages.push({ author: 'system', text: line });
          }
        }
      
        return messages;
      })
    ); // 👈 Das war vorher offen!
  }
}

