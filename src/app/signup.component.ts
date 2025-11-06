import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignUp } from './models/signup.model';
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
  constructor(private svc: PollService) {}

  signUp(){
    const newAccount : Account = {
      username : this.usernameField,
      // NEED TO DO PROPER HASH. WE MIGHT NEED TO INSTALL 'bcrypt' LIBRARY TO DO THIS
      password_hash : this.passwordField
    };
    this.svc.addAccount(newAccount).subscribe({
      next: _ => this.accountCreateSuccess = true,
      error: _ => {
        this.accountCreateSuccess = false;
        console.log("Error creating");
      }
    });
  }
}