import { Component } from '@angular/core';
import { PollService } from '../../services/poll.service';
import { Poll } from '../../models/poll.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Option } from '../../models/option.model';
import { AuthService } from '../../services/auth.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css','../submission_forms.css']
})
export class PollComponent {
  allPolls: Poll[] = [];
  questionField: string = '';
  optionsFields: string[] = ['', ''];
  errorMessage: string = '';
  loading = false;
  currentPage = 1;

  constructor(
    private pollSvc: PollService,
    private auth: AuthService,
  ) {}

  ngOnInit(){
    this.load();
  }

  load() {
    this.loading = true;
    this.pollSvc.getAllPolls(this.currentPage).subscribe({
      next: polls => {
        this.allPolls.push(...polls)
        this.loading = false
      },
      error: err => {
        if (err.status !== 403) {
          this.errorMessage = err.error?.message || 'Failed to load polls';
        }
      },
    });
  }

  onScrollDown() {
    if (this.loading) return;
    this.currentPage++;
    this.load();
  }

  vote(poll: Poll, option: Option) {
    if (!this.auth.isAuthenticated) {
      this.errorMessage = "You must be logged in to vote on a poll"
      return;
    }

    if (poll.user_vote || !poll.poll_id || !option.option_id){
      console.log("Poll or option selected is invalid");
    }

    this.pollSvc.castVote({
      poll_id: poll.poll_id,
      option_id: option.option_id,
    }).subscribe({
      next: _ => {
        poll.user_vote = option.option_id;
        option.vote_count = option.vote_count + 1;
      },
      error: err => this.errorMessage = err.error?.message || 'Vote failed',
    });
  }

  removeVote(poll: Poll, option: Option) {
    if (!this.auth.isAuthenticated) {
      this.errorMessage = "You must be logged in to remove vote on a poll"
      return;
    }
    if (!poll.user_vote || !poll.poll_id || !option.option_id)
      return;
    
    this.pollSvc.removeVote(poll.poll_id).subscribe(() => {
        option.vote_count = option.vote_count - 1;
        poll.user_vote = undefined;
        console.log("Vote removed");
    });
  }

  createNewPoll() {
    if (!this.auth.isAuthenticated) {
      this.errorMessage = "You must be logged in to create a poll"
      return;
    }

    if (!this.questionField) {
      this.errorMessage = "All polls must have a question"
      return;
    }

    if (this.optionsFields.some(option => option === '')) {
      this.errorMessage = "All options must be filled out"
      return;
    }

    const newPoll : any = {
      question : this.questionField,
      options : this.optionsFields,
    }

    this.pollSvc.addPoll(newPoll).subscribe({
      next: _ => {
        this.allPolls = [];
        this.currentPage = 1;
        this.questionField = "";
        this.optionsFields = ["", ""];
        this.load();
      },
      error: err => this.errorMessage = err.error?.message || 'Failed to create poll',
    });
  }

  addOptionField() {
    if (this.optionsFields.length < 8)
      this.optionsFields?.push("");
    else
      this.errorMessage = 'Polls are limited to 8 options'
  }
}
