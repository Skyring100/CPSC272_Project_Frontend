import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Poll } from '../../models/poll.model';
import { Option } from '../../models/option.model';
import { PollService } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent {
  // Using input / output in order to apply and get changes from other components
  @Input() poll!: Poll;
  @Input() showControls: boolean = false;
  
  @Output() deletePollClicked = new EventEmitter<Poll>();
  @Output() toggleVisibilityClicked = new EventEmitter<Poll>();

  voteTimeout: any = null;
  errorMessage: string | null = null;

  constructor(
    private pollSvc: PollService,
    private auth: AuthService
  ) {}

  get isCreator(): boolean {
    return this.poll.uuid === this.auth.user?.uuid;
  }

  get totalVotes(): number {
    if (!this.poll.options)
      return 0;
    return this.poll.options.reduce((sum, option) => sum + (option.vote_count || 0), 0);
  }

  getVotePercentage(option: Option) {
    if (this.totalVotes === 0)
      return 0;
    return ((option.vote_count || 0) / this.totalVotes) * 100;
  }

  onVoteClick(option: Option) {
    this.errorMessage = null;

    if (this.poll.user_vote === option.option_id)
      this.removeVote(option);
    else
      this.vote(option);
  }

  vote(option: Option) {
    if (this.voteTimeout) return;

    if (!this.auth.isAuthenticated) {
      this.errorMessage = "You must be logged in to vote on a poll";
      return;
    }

    if (!this.poll.poll_id || !option.option_id) {
      this.errorMessage = "Poll or option selected is invalid";
      return;
    }

    this.voteTimeout = setTimeout(() => {
      this.voteTimeout = null;
    }, 500);

    this.pollSvc.castVote({
      poll_id: this.poll.poll_id,
      option_id: option.option_id,
    }).subscribe({
      next: _ => {
        this.poll.user_vote = option.option_id;
        option.vote_count = option.vote_count + 1;
      },
      error: err => this.errorMessage = err.error?.message || 'Vote failed',
    });
  }

  removeVote(option: Option) {
    if (this.voteTimeout) return;

    if (!this.auth.isAuthenticated) {
      this.errorMessage = "You must be logged in to remove vote on a poll";
      return;
    }

    if (!this.poll.user_vote || !this.poll.poll_id || !option.option_id)
      return;

    this.voteTimeout = setTimeout(() => {
      this.voteTimeout = null;
    }, 500);
    
    this.pollSvc.removeVote(this.poll.poll_id).subscribe({
      next: () => {
        option.vote_count = option.vote_count - 1;
        this.poll.user_vote = undefined;
      },
      error: err => this.errorMessage = err.error?.message || 'Failed to remove vote',
    });
  }

  onDeleteClick() {
    this.deletePollClicked.emit(this.poll);
  }

  onToggleVisibility() {
    this.toggleVisibilityClicked.emit(this.poll);
  }

  isVoteDisabled(option: Option): boolean {
    if (this.voteTimeout) return true;
    if (this.isCreator && this.showControls) return true;
    return !!(this.poll.user_vote && this.poll.user_vote !== option.option_id);
  }
}