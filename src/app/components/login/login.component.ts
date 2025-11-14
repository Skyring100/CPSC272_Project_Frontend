import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';


@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './submission_forms.css']
})
export class LogInComponent {
  currentAccount : Account | undefined;

  usernameField : string | undefined;
  passwordField : string | undefined;

  loginSuccess : boolean | undefined;

  constructor(private svc: AccountService) {}
  
  ngOnInit(){
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount') || '{}');
    console.log("Current account: "+this.currentAccount?.username + " with uuid "+this.currentAccount?.uuid);
  }

  logIn(){
    if(this.usernameField == undefined || this.passwordField == undefined){
      console.log("Username or password is blank");
      return;
    }
    //TODO: use password hash
    this.svc.getAccount(this.usernameField, this.passwordField).subscribe({
      next: rows => {
        console.log(rows);
        if(rows.length != 0){
          // We found their account to log in
          this.currentAccount = rows[0];
          localStorage.setItem('currentAccount', JSON.stringify(this.currentAccount));
          this.loginSuccess = true;
        }else{
          // There is no account with this username and password
          // TODO: show user theses no account
          console.log("Could not find account");
          this.loginSuccess = false;
        }
      },
      error: () => console.log("Error loggin in"),
      complete: () => {
        console.log("Log in attempt finished");
      }
    });
  }

  logOut(){
    localStorage.clear();
    this.currentAccount = undefined;
  }
}
