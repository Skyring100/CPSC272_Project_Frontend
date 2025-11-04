import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poll } from '../models/poll.model';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class PollService {
  //This class is for interfacing with the backend. Our app.component.ts will call these methods by creating an instance of this class
  private pollAPI = `${environment.apiUrl}/polls`;
  private accountAPI = `${environment.apiUrl}/accounts`;
  constructor(private http: HttpClient) {}

  // Polls

  getPoll(): Observable<Poll[]> {
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

  getAccount(): Observable<Account[]> {
    return this.http.get<Account[]>(this.accountAPI);
  }
  addAccount(acc: Account){
    return this.http.post<Account>(this.accountAPI, acc);
  }
  updateAccount(uuid: number, a: Account): Observable<Poll> {
    return this.http.put<Account>(`${this.accountAPI}/${uuid}`, a);
  }
  deleteAccount(uuid : number){
    return this.http.delete<{ ok: boolean }>(`${this.accountAPI}/${uuid}`);
  }
}