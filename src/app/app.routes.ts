import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ThoughtsComponent } from './thoughts/thoughts.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatComponent // default route
  },
  {
    path: 'thoughts/:name',
    component: ThoughtsComponent
  }
];
