import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserModel, UsersResponse } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(limit = 10, skip = 0): Observable<UsersResponse> {
    const params = new HttpParams().set("limit", limit).set("skip", skip);
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, {params});
  }

  getUserById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/users/${id}`);
  }

  searchUsers(query: string, limit = 10, skip = 0): Observable<UsersResponse> {
    const params = new HttpParams().set("q", query).set("limit", limit).set("skip", skip);
    return this.http.get<UsersResponse>(`${this.apiUrl}/users/search`, {params});
  }
}
