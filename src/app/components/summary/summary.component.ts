import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.services';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  user$ = this.auth.user$;
  errorMessage: string = '';
  userPolls: Poll[] = [];
  currentPassword = '';
  newPassword = '';
  
  
  constructor(
    private accountSvc: AccountService,
    private router : Router,
    private pollSvc: PollService,
    private auth: AuthService,
  ) {}
  
  
  ngOnInit(){
    this.accountSvc.getUserPolls().subscribe({
      next: polls => this.userPolls = polls,
      error: (err) => this.errorMessage = err.error?.message || 'Failed to load polls',
    });
  }

  logOut() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

  updateAccount() {
    this.accountSvc.updateAccount({ 
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (err) => this.errorMessage = err.error?.message || 'Failed to update password',
    });
  }

  deleteAccount(){
    this.accountSvc.deleteAccount().subscribe({
      next: _ => this.logOut(),
      error: (err) => this.errorMessage = err.error?.message || 'Failed to delete account',
    });
  }

  deletePoll(p : Poll){
    this.pollSvc.deletePoll(p.poll_id).subscribe(() => {
      this.userPolls = this.userPolls.filter(poll => poll.poll_id !== p.poll_id);
    });
  }
}