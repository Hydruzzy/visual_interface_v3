import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:5000/api/v1/messages?'; // 🔁 KEIN localhost:5000 mehr


  constructor(private http: HttpClient) {}

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getGameList(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/v1/games?limit=100');
  }
  getMessagesByGameId(gameId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5000/api/v1/messages?limit=100&gameId=${gameId}`);
  }
  
}

