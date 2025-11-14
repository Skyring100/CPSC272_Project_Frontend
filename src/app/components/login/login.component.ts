import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','../submission_forms.css']
})
export class LogInComponent {
  usernameField: string = '';
  passwordField: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/poll']);
    }
  }

  logIn() {
    if (!this.usernameField || !this.passwordField) {
      this.errorMessage = 'Username and password are blank';
      return;
    }

    this.errorMessage = '';

    this.auth.login(this.usernameField, this.passwordField).subscribe({
      next: _ => this.router.navigateByUrl('/poll'),
      error: err => this.errorMessage = err.error?.message || 'Login failed',
    });
  }
}
