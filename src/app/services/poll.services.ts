import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poll } from '../models/poll.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PollService {
  //This class is for interfacing with the backend. Our app.component.ts will call these methods by creating an instance of this class
  private apiUrl = `${environment.apiUrl}/families`;
  constructor(private http: HttpClient) {}

  getPoll(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.apiUrl);
  }
  addPoll(f: Poll): Observable<Poll> {
    return this.http.post<Poll>(this.apiUrl, f);
  }
  updatePoll(id: number, f: Poll): Observable<Poll> {
    return this.http.put<Poll>(`${this.apiUrl}/${id}`, f);
  }
  deletePoll(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.apiUrl}/${id}`);
  }
}