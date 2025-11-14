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
  usernameField: string = '';
  passwordField: string = '';
  confirmPasswordField: string = '';
  errorMessage: string = '';
  
  constructor(
    private accountService: AccountService,
    private router: Router,
    private auth: AuthService,
  ) {}
  
  ngOnInit() {
    if (this.auth.isAuthenticated) {
      this.router.navigateByUrl('/poll');
    }
  }

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