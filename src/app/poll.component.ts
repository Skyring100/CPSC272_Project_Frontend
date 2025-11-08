import { Component } from '@angular/core';
import { PollService } from './services/poll.services';
import { Poll } from './models/poll.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from './models/account.model';


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

  constructor(private svc: PollService) {}

  ngOnInit(){
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount') || '{}');
    console.log("Current account: "+this.currentAccount?.username + " with uuid "+this.currentAccount?.uuid);
    this.load();
  }


  select(selectedPoll: Poll, selectedOption: String){
    console.log("For the poll \""+selectedPoll.question+"\", you chose \""+selectedOption+"\"");
  }
  
  // This is basically what we will dow when backend is done
  load() {
    console.log("Loading Polls...")
    this.loading = true;
    this.svc.getPollWithOptions().subscribe({
      next: rows => {
        console.log(rows);
       this.allPolls = this.svc.reconstructPoll(rows);
      },
      error: () => console.log("There was a problem loading polls"),
      complete: () => {
        this.loading = false;
        console.log(this.allPolls);
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
    const newPoll : Poll = {
      question : this.questionField,
      options : this.optionsFields
    }
    console.log(newPoll);
    this.svc.addPoll(newPoll).subscribe({
      next: _ => {  },
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
   const dummyPolls : Poll[] = [
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
    dummyAccounts.forEach(dummyAccount => {
      this.createNewAccount(dummyAccount);
    });
    dummyPolls.forEach(dummyPoll => {
      this.questionField = dummyPoll.question;
      if(dummyPoll.options){
        this.optionsFields = dummyPoll.options;
      }
      this.createNewPoll();
    });
  }
}
