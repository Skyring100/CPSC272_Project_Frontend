import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poll } from '../models/poll.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PollService {
  private pollAPI = `${environment.apiUrl}/polls`;
  private voteAPI = `${environment.apiUrl}/vote`;

  constructor(private http: HttpClient) {}

  // Added paging support here and a temp button instead of a onHover div for now
  getAllPolls(page: number): Observable<Poll[]> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<Poll[]>(`${this.pollAPI}/get`, { params, withCredentials: true });
  }
  

  addPoll(p: Poll): Observable<Poll> {
    return this.http.post<Poll>(`${this.pollAPI}/create`, p);
  }

  updatePollVisibility(id: number, is_visible: boolean): Observable<Poll> {
    return this.http.patch<Poll>(`${this.pollAPI}/${id}`, { is_visible });
  }

  deletePoll(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.pollAPI}/${id}`);
  }


  castVote(voteData: { poll_id: number; option_id: number }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.voteAPI}/cast`, voteData);
  }
}