import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from './services/poll.services';
import { Account } from './models/account.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  currentAccount : Account | undefined;

  showAccountEditOptions : boolean = false;
  newUsernameField : string | undefined;
  constructor(private svc: PollService, private router : Router) {}
  ngOnInit(){
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount') || '{}');
    console.log("Current account: "+this.currentAccount?.username + " with uuid "+this.currentAccount?.uuid);
    if(this.currentAccount?.uuid == undefined){
      // Take user to sign up page
      this.router.navigateByUrl("/signup");
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
        // TODO: fill out updated account information
      };
      this.svc.updateAccount(this.currentAccount.uuid, updatedAccount);
    }
  }

  deleteCurrentAccount(){
    if(this.currentAccount?.uuid == undefined){
      console.error("Current account has undefined UUID");
    }else{
      this.svc.deleteAccount(this.currentAccount.uuid);
    }
  }
}