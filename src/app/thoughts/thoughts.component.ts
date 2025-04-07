import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-thoughts',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './thoughts.component.html',
  styleUrls: ['./thoughts.component.scss']
})
export class ThoughtsComponent implements OnInit {
  playerName = '';
  text = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.playerName = this.route.snapshot.paramMap.get('player') || '';
    const file = `/thoughts_${this.playerName.charAt(0).toUpperCase() + this.playerName.slice(1)}.txt`;

    this.http.get(file, { responseType: 'text' }).subscribe(content => {
      this.text = content;
    });
  }
}
