import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private accountAPI = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

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
}