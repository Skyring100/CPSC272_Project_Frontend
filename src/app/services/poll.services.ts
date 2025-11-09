import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poll } from '../models/poll.model';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';
import { PollWithOptions } from '../models/pollWithOptions.model';

@Injectable({ providedIn: 'root' })
export class PollService {
  //This class is for interfacing with the backend. Our app.component.ts will call these methods by creating an instance of this class
  private pollAPI = `${environment.apiUrl}/polls`;
  private accountAPI = `${environment.apiUrl}/accounts`;
  private pollWithOptionsAPI = `${environment.apiUrl}/pollWithOptions`;
  private voteAPI = `${environment.apiUrl}/vote`;
  constructor(private http: HttpClient) {}

  // Polls

  getPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.pollAPI);
  }
  addPoll(p: Poll): Observable<Poll> {
    return this.http.post<Poll>(this.pollAPI, p);
  }
  updatePoll(id: number, p: Poll): Observable<Poll> {
    return this.http.put<Poll>(`${this.pollAPI}/${id}`, p);
  }
  deletePoll(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.pollAPI}/${id}`);
  }

  // Account

  getAccount(username: string, passwordHash: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.accountAPI}/${username}/${passwordHash}`);
  }
  addAccount(acc: Account) : Observable<Account>{
    return this.http.post<Account>(this.accountAPI, acc);
  }
  updateAccount(uuid: number, a: Account): Observable<Account> {
    return this.http.put<Account>(`${this.accountAPI}/${uuid}`, a);
  }
  deleteAccount(uuid : number): Observable<{ ok: boolean }>{
    return this.http.delete<{ ok: boolean }>(`${this.accountAPI}/${uuid}`);
  }

  castVote(voteData: { uuid: number; poll_id: number; option_id: number }): Observable<any> {
    return this.http.post(this.voteAPI, voteData);
  }


  // POLL-OPTIONS
  // getPollWithOptions(): Observable<PollWithOptions[]>{
  //   return this.http.get<PollWithOptions[]>(this.pollWithOptionsAPI);
  // }

  // Reconstruction
  // reconstructPoll(rows : PollWithOptions[]) : Poll[]{
  //       const allPolls : Poll[] = [];
  //       // For each joined Poll-Option row, 
  //       for (let i = 0; i < rows.length; i++) {
  //         // Assign basic poll data
  //         var newPollData : PollWithOptions = rows[i];
  //         var createdPoll : Poll = {
  //           poll_id : newPollData.poll_id,
  //           question : newPollData.question,
  //           options : []
  //         };
  //         // Now we need to add the options
  //         var nextOption : PollWithOptions = newPollData;
  //         do {
  //           if(createdPoll.options == undefined) throw new Error("Created poll options is not defined???");
  //           if(nextOption.content == undefined) throw new Error("Option content is undefined???");
  //           createdPoll.options.push(nextOption.content);
  //           // Get the next row of poll-option data
  //           i++;
  //           // Check if we at the end of poll with options table. If so, we can skip to being done
  //           if(i == rows.length) break;
  //           nextOption = rows[i];
  //         } while (nextOption.poll_id == createdPoll.poll_id);
  //         // Once we are done with this poll's options, we must move index back by one to account for next poll's options
  //         i--;
  //         allPolls.push(createdPoll);
  //       }
  //       return allPolls;
  // }
}