import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-thoughts',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './thoughts.component.html',
  styleUrls: ['./thoughts.component.scss']
})
export class ThoughtsComponent implements OnInit {
  thoughts: { name: string, text: SafeHtml }[] = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const files = ['Tom', 'Helena', 'Kyve', 'Max'];

    files.forEach(name => {
      this.http.get(`/thoughts_${name}.txt`, { responseType: 'text' }).subscribe(content => {
        const formatted = this.formatThoughtText(content);
        this.thoughts.push({ name, text: formatted });
      });
    });
  }

  formatThoughtText(text: string): SafeHtml {
    const formatted = text
      .replace(/---/g, '<hr>')
      .replace(/(Thoughts of.*?)(\n|$)/gi, '<strong>$1</strong><br>')
      .replace(/(My reasoning.*?)(\n|$)/gi, '<strong>$1</strong><br>')
      .replace(/(My reflection.*?)(\n|$)/gi, '<strong>$1</strong><br>')
      .replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}
