import { Component } from '@angular/core';
import { PollService } from '../../services/poll.service';
import { Poll } from '../../models/poll.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PollComponent } from '../poll/poll.component';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollModule, PollComponent],
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css', '../submission_forms.css']
})
export class PollListComponent {
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
        if (err.status !== 403)
          this.errorMessage = err.error?.message || 'Failed to load polls';
        this.loading = false;
      },
    });
  }

  onScrollDown() {
    if (this.loading) return;
    this.currentPage++;
    this.load();
  }

  onError(message: string) {
    this.errorMessage = message;
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
        this.errorMessage = "";
        this.load();
      },
      error: err => this.errorMessage = err.error?.message || 'Failed to create poll',
    });
  }

  addOptionField() {
    this.errorMessage = "";
    if (this.optionsFields.length < 8)
      this.optionsFields?.push("");
    else
      this.errorMessage = 'Polls are limited to 8 options'
  }

  removeOptionField() {
    this.errorMessage = "";
    if (this.optionsFields.length > 2)
      this.optionsFields?.pop();
    else
      this.errorMessage = 'Polls must have at least 2 options'
  }
}