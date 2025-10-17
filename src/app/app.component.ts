

import { Component } from '@angular/core';
import { PollComponent } from './poll.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PollComponent],
  template: `<app-poll />`
})
export class AppComponent {}