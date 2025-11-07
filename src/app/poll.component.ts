import { Component } from '@angular/core';
import { PollService } from './services/poll.services';
import { Poll } from './models/poll.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from './models/account.model';
import { PollWithOptions } from './models/pollWithOptions.model';


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
  message : String = "Welcome to Pollio :O";
  loading = false;
  constructor(private svc: PollService) {}

  ngOnInit(){
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount') || '{}');
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
        // For each joined Poll-Option row, 
        for (let i = 0; i < rows.length; i++) {
          // Assign basic poll data
          var newPollData : PollWithOptions = rows[i];
          var createdPoll : Poll = {
            poll_id : newPollData.poll_id,
            question : newPollData.question,
            options : []
          };
          console.log(createdPoll);
          // Now we need to add the options
          var nextOption : PollWithOptions = newPollData;
          do {
            if(createdPoll.options == undefined) throw new Error("Created poll options is not defined???");
            if(nextOption.content == undefined) throw new Error("Option content is undefined???");
            console.log(nextOption.content)
            createdPoll.options.push(nextOption.content);
            // Get the next row of poll-option data
            i++;
            // Check if we at the end of poll with options table. If so, we can skip to being done
            if(i == rows.length) break;
            nextOption = rows[i];
          } while (nextOption.poll_id == createdPoll.poll_id);
          // Once we are done with this poll's options, we must move index back by one to account for next poll's options
          i--;
          this.allPolls.push(createdPoll);
        }
      },
      error: () => this.message = 'Load failed',
      complete: () => {
        this.loading = false;
        console.log(this.allPolls);
      }
    });
  }

  createNewAccount(newAccount : Account){
    console.log("Creating a new poll in database...");
    this.svc.addAccount(newAccount).subscribe({
      next: _ => {  },
      error: _ => { }
    });
  }

  createNewPoll(newPoll : Poll){
    console.log("Creating a new poll in database...");
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
      this.createNewPoll(dummyPoll)
    });
  }
}
