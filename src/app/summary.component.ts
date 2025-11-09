import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from './services/poll.services';
import { Account } from './models/account.model';
import { Router } from '@angular/router';
import { Poll } from './models/poll.model';
import { Option } from './models/option.model';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  currentAccount : Account | undefined;
  allUserPolls : Poll[] = [];

  showAccountEditOptions : boolean = false;
  newUsernameField : string | undefined;
  constructor(private svc: PollService, private router : Router) {}
  ngOnInit(){
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount') || '{}');
    console.log("Current account: "+this.currentAccount?.username + " with uuid "+this.currentAccount?.uuid);
    if(this.currentAccount?.uuid == undefined){
      // Take user to sign up page
      this.router.navigateByUrl("/signup");
    }else{
      // Get all polls made by this user and get all get all votes from this user

    }
  }

  toggleShowAccountEditOptions(){
    this.showAccountEditOptions = !this.showAccountEditOptions;
  }

  updateCurrentAccount(){
    if(this.currentAccount?.uuid == undefined){
      console.error("Current account has undefined UUID");
    }else{
      const updatedAccount : Account = {
        uuid : this.currentAccount.uuid,
        username : this.newUsernameField,
        password_hash : this.currentAccount.password_hash
      };
      this.svc.updateAccount(this.currentAccount.uuid, updatedAccount).subscribe({
        next: acc => {
          this.currentAccount = acc;
          localStorage.setItem('currentAccount', JSON.stringify(this.currentAccount));
          console.log("Account Successfully Updated");
        },
        error: _ => {
          console.error("Update failed");
        }
      });
    }
  }

  deleteCurrentAccount(){
    if(this.currentAccount?.uuid == undefined){
      console.error("Current account has undefined UUID");
    }else{
      this.svc.deleteAccount(this.currentAccount.uuid).subscribe({
        next: _ => {
          this.currentAccount = {}
          localStorage.clear();
          console.log("Account Successfully Deleted");
        },
        error: _ => console.error("Delete failed")
      });
    }
  }


  select(selectedPoll: Poll, selectedOption: Option){
    console.log("For the poll \""+selectedPoll.question+"\", you chose \""+selectedOption.content+"\"");
    // Check if user is logged in
    if(this.currentAccount?.uuid == undefined){
      this.router.navigateByUrl('/signup');
    }else{
      // TODO: Send vote to database
      console.log("Sending vote...");

      // TODO: If vote was successful, display the results

    }
  }

  deletePoll(p : Poll){
    if(p.uuid == undefined){
      console.error("Poll UUID is undefined");
    }else{
      this.svc.deletePoll(p.uuid);
    }
  }

  logOut(){
    this.currentAccount = {};
    localStorage.clear();
  }
}