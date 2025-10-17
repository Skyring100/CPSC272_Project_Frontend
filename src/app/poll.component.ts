import { Component } from '@angular/core';
import { PollService } from './services/poll.services';
import { Poll } from './models/poll.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent {
  //This class provides methods and state that the app.component.html can directly call and access
  allPolls : Poll[] = [];
  constructor(private svc: PollService) {}
  message : String = "Welcome to Pollio :O";
  select(){
    this.svc.getPoll().subscribe({
      next: rows => this.allPolls = rows,
      error: () => this.message = 'Oh naur it broked'
    });
  }
}
