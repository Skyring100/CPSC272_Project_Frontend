import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './submission_forms.css']
})
export class SignUpComponent {
  accountCreateSuccess : boolean | undefined = undefined;
  usernameField : string | undefined;
  passwordField : string | undefined;
  confirmPasswordField : string | undefined;
  currentAccount : Account | undefined;
  
  constructor(private svc: AccountService) {}
  
  ngOnInit(){
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount') || '{}');
    console.log("Current account: "+this.currentAccount?.username + " with uuid "+this.currentAccount?.uuid);
  }

  logOut(){
    localStorage.clear();
    this.currentAccount = undefined;
  }

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
      next: acc => {
        this.accountCreateSuccess = true;
        this.currentAccount = acc;
        localStorage.setItem('currentAccount', JSON.stringify(this.currentAccount)); 
      },
      error: _ => {
        this.accountCreateSuccess = false;
        console.log("Error creating");
      }
    });
  }
}