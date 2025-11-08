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
        uuid: 2,
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
  
  // This is basically what we will dow when backend is done

  load() {
    console.log("Loading Polls...")
    this.loading = true;
    this.svc.getPolls().subscribe({
      next: polls => {
        this.allPolls = polls;
      },
      error: () => console.log("There was a problem loading polls"),
      complete: () => {
        this.loading = false;
        console.log(this.allPolls);
      }
    });
  }
  // load() {
  //   console.log("Loading Polls...")
  //   this.loading = true;
  //   this.svc.getPollWithOptions().subscribe({
  //     next: rows => {
  //      this.allPolls = this.svc.reconstructPoll(rows);
  //     },
  //     error: () => console.log("There was a problem loading polls"),
  //     complete: () => {
  //       this.loading = false;
  //       console.log(this.allPolls);
  //     }
  //   });
  // }

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
      uuid: this.currentAccount?.uuid
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

  createDummyData(){
    console.log("Creating dummy data...");
    const dummyAccounts : Account[] = [
    {
      username: "Joe",
      password_hash: "aaa"
    }
  ];
   const dummyPolls : any[] = [
    {
      question: "Cat or Dog?",
      options: ["Cat", "Dog"],
      uuid : 3
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
    dummyAccounts.forEach(dummyAccount => {
      this.createNewAccount(dummyAccount);
    });
    dummyPolls.forEach(dummyPoll => {
      this.questionField = dummyPoll.question;
      this.optionsFields = dummyPoll.options;
      this.createNewPoll();
    });
    this.questionField = "";
    this.optionsFields = ["", ""];
  }
}
