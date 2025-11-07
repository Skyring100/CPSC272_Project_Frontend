import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from './services/poll.services';
import { Account } from './models/account.model';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
  accountCreateSuccess : boolean | undefined = undefined;
  usernameField : string | undefined;
  passwordField : string | undefined;
  confirmPasswordField : string | undefined;
  createdAccount : Account | undefined;
  constructor(private svc: PollService) {}

  signUp(){
    // Check if verify password filed matches password
    if(!(this.passwordField === this.confirmPasswordField)){
      // Passwords do not match, must let user know
      // TODO: LET USER KNOW PASSWORDS DONT MATCH
      console.log("Passwords do not match!");
      return;
    }

    const newAccount : Account = {
      username : this.usernameField,
      // NEED TO DO PROPER HASH. WE MIGHT NEED TO INSTALL 'bcrypt' LIBRARY TO DO THIS
      // TODO: HASH PASSWORD
      password_hash : this.passwordField
    };
    this.svc.addAccount(newAccount).subscribe({
      next: _ => {
        this.accountCreateSuccess = true;
        this.createdAccount = newAccount;
        // Move user to account summary page
        console.log(this.createdAccount)
        localStorage.setItem('currentAccount', JSON.stringify(this.createdAccount)); 
      },
      error: _ => {
        this.accountCreateSuccess = false;
        console.log("Error creating");
      }
    });
  }
}