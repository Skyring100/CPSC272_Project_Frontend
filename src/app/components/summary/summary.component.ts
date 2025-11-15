import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { PollComponent } from '../poll/poll.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, PollComponent],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css', '../submission_forms.css']
})
export class SummaryComponent {
  username: string | null | undefined = '';
  errorMessage: string = '';
  userPolls: Poll[] = [];
  votedPolls: Poll[] = [];
  currentPassword = '';
  newPassword = '';
  changePasswordSuccess : boolean | undefined;
  viewMode: 'created' | 'voted' = 'created';
  
  constructor(
    private accountSvc: AccountService,
    private router : Router,
    private pollSvc: PollService,
    private auth: AuthService,
  ) {}
  
  ngOnInit(){
    this.username = this.auth.user?.username;
    this.accountSvc.getUserPolls().subscribe({
      next: polls => this.userPolls = polls,
      error: err => this.errorMessage = err.error?.message || 'Failed to load created polls',
    });
    this.accountSvc.getUserVotedPolls().subscribe({
      next: polls => this.votedPolls = polls,
      error: err => this.errorMessage = err.error?.message || 'Failed to load voted polls',
    });
  }

  setView(mode: 'created' | 'voted') {
    this.viewMode = mode;
  }

  logOut() {
    this.auth.logout().subscribe({
      next: _ => this.router.navigate(['/login']),
      error: err => this.errorMessage = err.error?.message || 'logout failed',
    });
  }

  updateAccount() {
    if (!this.currentPassword || !this.newPassword) {
      this.errorMessage = "You must fill current password and new password fields";
      return;
    }

    this.accountSvc.updateAccount({ 
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: _ => {
        this.currentPassword = '';
        this.newPassword = '';
        this.errorMessage = '';
        this.changePasswordSuccess = true;
      },
      error: err => this.errorMessage = err.error?.message || 'Failed to update password',
    });
  }

  deleteAccount(){
    this.accountSvc.deleteAccount().subscribe({
      next: _ => this.logOut(),
      error: err => this.errorMessage = err.error?.message || 'Failed to delete account',
    });
  }

  deletePoll(poll: Poll){
    this.pollSvc.deletePoll(poll.poll_id).subscribe(() => {
      this.userPolls = this.userPolls.filter(p => p.poll_id !== poll.poll_id);
      this.votedPolls = this.votedPolls.filter(p => p.poll_id !== poll.poll_id);
    });
  }

  toggleVisibility(poll: Poll) {
    this.pollSvc.updatePollVisibility(poll.poll_id, !poll.is_visible).subscribe({
      next: updatedPoll => poll.is_visible = updatedPoll.is_visible,
      error: err => this.errorMessage = err.error?.message || 'Failed to update poll visibility'
    });
  }

  onError(message: string) {
    this.errorMessage = message;
  }
}