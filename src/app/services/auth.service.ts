import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Use 3 states instead of just 2 so we know the difference between
  // not initialized and logged out. This simplifies the guard as we
  // don't have to figure out the difference between them
  // I.e. navigate to login after logout
  private userSubject = new BehaviorSubject<Account | null | undefined>(undefined);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuth();
  }

  private checkAuth(): void {
    this.http.get<Account>(`${environment.apiUrl}/verify`)
      .pipe(catchError(() => of(null)))
      .subscribe(user => this.userSubject.next(user));
  }

  login(username: string, password: string): Observable<Account> {
    return this.http.post<Account>(`${environment.apiUrl}/login`, { username, password })
      .pipe(tap(user => this.userSubject.next(user)));
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/logout`, {})
      .pipe(tap(() => this.userSubject.next(null)));
  }

  get user(): Account | null | undefined {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    const user = this.userSubject.value;
    return user !== null && user !== undefined;
  }
}