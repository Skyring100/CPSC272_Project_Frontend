import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css','../submission_forms.css']
})
export class SignUpComponent {
  readonly MAX_USERNAME_LENGTH: number = 26;
  usernameField: string = '';
  passwordField: string = '';
  confirmPasswordField: string = '';
  errorMessage: string = '';
  
  constructor(
    private accountService: AccountService,
    private router: Router,
    private auth: AuthService,
  ) {}
  
  ngOnInit() {}

  signUp() {
    this.errorMessage = '';

    // Make sure fields exist
    if (!this.usernameField || !this.passwordField || !this.confirmPasswordField) {
      this.errorMessage = 'All fields are required';
      return;
    }

    // Check if verify password field matches password
    if (this.passwordField !== this.confirmPasswordField) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const nameLen = this.usernameField.length;

    if (nameLen < 3) {
      this.errorMessage = 'Username is too short. Usernames must be at least 3 characters';
      return;
    }

    // Check if username is too long
    if (this.usernameField.length > this.MAX_USERNAME_LENGTH) {
      this.errorMessage = 'Username is too long (max '+this.MAX_USERNAME_LENGTH+" chracters)";
      return;
    }

    this.accountService.addAccount({
      username: this.usernameField,
      password: this.passwordField
    }).subscribe({
      next: _ => {  // Auto-login after successful signup
        this.auth.login(this.usernameField, this.passwordField).subscribe({
          next: _ => this.router.navigateByUrl('/poll'),
          error: err => this.errorMessage = err.error?.message || 'Login failed',
        });
      },
      error: err => this.errorMessage = err.error?.message || 'Failed to create account',
    });
  }
}