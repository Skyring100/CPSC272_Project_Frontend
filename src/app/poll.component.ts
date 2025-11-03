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
  loading = false;


  select(selectedPoll: Poll, selectedOption: String){
      console.log("For the poll \""+selectedPoll.question+"\", you chose \""+selectedOption+"\"");
  }
  /*
  load(){
    //dummy test to see if frontend work (we will switch this to actually using an http request to get data from database)
    this.allPolls = [
      {
        question: "Cat or Dog?",
        options: ["Cat", "Dog"]
      },
      {
        question: "Best operating system?",
        options: ["Windows", "Mac", "Linux"]
      },
      {
        question: "Favorite Color?",
        options: ["Blue", "Green", "Red", "Yellow", "Purple", "Orange"]
      }
    ];
  }
    */
  //This is basically what we will dow when backend is done
  load() {
    console.log("Loading Polls...")
    this.loading = true;
    this.svc.getPoll().subscribe({
      next: rows => this.allPolls = rows,
      error: () => this.message = 'Load failed',
      complete: () => this.loading = false
    });
  }
}
