import { Component } from '@angular/core';
import { PollService } from './services/poll.services';
import { Poll } from './models/poll.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  //This class provides methods and state that the app.component.html can directly call and access
  allPolls : Poll[] = [];
  constructor(private svc: PollService) {}
  message : String = "";
  select(){
    this.svc.getPoll().subscribe({
      next: rows => this.allPolls = rows,
      error: () => this.message = 'Oh naur it broked'
    });
  }
}
