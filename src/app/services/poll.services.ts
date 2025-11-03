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
  
  addAccount(acc: Account){
    return this.http.post<Poll>(this.accountAPI, acc);
  }
}