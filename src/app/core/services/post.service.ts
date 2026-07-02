import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PostsResponse } from '../models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUserPostsById(userId: number): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(`${this.apiUrl}/posts/user/${userId}`);
  }
}
