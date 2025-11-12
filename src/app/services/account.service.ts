import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';
import { Poll } from '../models/poll.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private accountAPI = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  addAccount(acc: { username?: string; password?: string }): Observable<Account> {
    return this.http.post<Account>(`${this.accountAPI}/create`, acc);
  }

  updateAccount(passwords: { currentPassword?: string; newPassword?: string }): Observable<Account> {
    return this.http.put<Account>(`${this.accountAPI}/update`, passwords);
  }

  deleteAccount(): Observable<{ ok: boolean }>{
    return this.http.delete<{ ok: boolean }>(`${this.accountAPI}/delete`);
  }


  getUserPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.accountAPI}/polls`, { withCredentials: true });
  }

  getUserVotedPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.accountAPI}/votes`);
  }
}