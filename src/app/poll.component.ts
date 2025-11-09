import { Component } from '@angular/core';
import { PollService } from './services/poll.services';
import { Poll } from './models/poll.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from './models/account.model';
import { Router } from '@angular/router';
import { Option } from './models/option.model';


@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent {
  currentAccount : Account | undefined;
  //This class provides methods and state that the app.component.html can directly call and access
  allPolls : Poll[] = [];
  loading = false;

  isCreatingPoll : boolean = false;
  questionField : string | undefined;
  optionsFields : string[] = ["", ""];

  constructor(private svc: PollService, private router: Router) {}

  ngOnInit(){
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount') || '{}');
    console.log("Current account: "+this.currentAccount?.username + " with uuid "+this.currentAccount?.uuid);
    this.load();
  }


  select(selectedPoll: Poll, selectedOption: Option) {
    // if (!this.currentAccount?.uuid) {
    //   this.router.navigateByUrl('/signup');
    //   return;
    // }

    if (selectedPoll.user_vote) {
      console.log('User has already voted in this poll.');
      return;
    }

    if (selectedPoll.poll_id && selectedOption.option_id) {
      this.svc.castVote({
        uuid: 3,
        poll_id: selectedPoll.poll_id,
        option_id: selectedOption.option_id,
      }).subscribe({
        next: () => {
          selectedPoll.user_vote = selectedOption.option_id;
          selectedOption.vote_count = (selectedOption.vote_count || 0) + 1;
        },
        error: (err) => {
          if (err.status === 409) {
            console.log('User has already voted in this poll.');
          } else {
            console.error('Error casting vote:', err);
          }
        }
      });
    }
  }

  load() {
    this.loading = true;
    this.svc.getPolls().subscribe({
      next: polls => {
        this.allPolls = polls;
      },
      error: () => console.log("There was a problem loading polls"),
      complete: () => {
        this.loading = false;
      }
    });
  }

  togglePollCreation(){
    this.isCreatingPoll = !this.isCreatingPoll;
  }

  addOptionField(){
    this.optionsFields?.push("");
  }

  createNewAccount(newAccount : Account){
    console.log("Creating a new poll in database...");
    this.svc.addAccount(newAccount).subscribe({
      next: _ => {  },
      error: _ => { }
    });
  }

  createNewPoll(){
    console.log("Creating a new poll in database...");

    const newPoll : any = {
      question : this.questionField,
      options : this.optionsFields,
      uuid: 1
    }

    console.log(newPoll);
    this.svc.addPoll(newPoll).subscribe({
      next: _ => {
        this.load(); // Refresh the poll list immediately when adding a new poll
        this.questionField = "";
        this.optionsFields = ["", ""];
      },
      error: _ => { }
    });
  }

  createDummyAccount(){
    const dummyAccounts : Account[] = [
      {
        username: "Joe",
        password_hash: "aaa"
      },
      {
        username: "Bob",
        password_hash: "aaa"
      },
      {
        username: "Job",
        password_hash: "aaa"
      }
    ]

    dummyAccounts.forEach(dummyAccount => {
      this.createNewAccount(dummyAccount);
    });
  }

  createDummyData(){
    console.log("Creating dummy data...");
    const dummyPolls : any[] = [
      {
        question: "Cat or Dog?",
        options: ["Cat", "Dog"],
        uuid : 3
      },
      {
        question: "Best operating system?",
        options: ["Windows", "Mac", "Linux"],
        uuid : 2
      },
      {
        question: "Favorite Color?",
        options: ["Blue", "Green", "Red", "Yellow", "Purple", "Orange"],
        uuid : 1
      }
    ];
  
    dummyPolls.forEach(dummyPoll => {
      this.questionField = dummyPoll.question;
      this.optionsFields = dummyPoll.options;
      this.createNewPoll();
    });
    this.questionField = "";
    this.optionsFields = ["", ""];
  }
}
