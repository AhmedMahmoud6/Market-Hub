import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { map, Observable, tap } from 'rxjs';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private currentUserSignal = signal<AuthUser | null>(null);

  currentUser = this.currentUserSignal.asReadonly();

  isLoggedIn = computed(() => {
    return !!this.currentUser() || !!this.getAccessToken();
  });

  currentUserRole = computed(() => {
    return this.currentUser()?.role || null;
  });

  login(data: LoginRequest): Observable<AuthUser> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      map(response => {
        const role = this.getFakeRole(response.id);

        return {
          ...response,
          age: 0,
          phone: "",
          role,
        } as AuthUser

      }),
      tap(user => {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, user.accessToken ?? "");
        localStorage.setItem(this.REFRESH_TOKEN_KEY, user.refreshToken ?? "");
        this.currentUserSignal.set(user);
      })
    )
  }

  loadCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/auth/me`).pipe(
      map(user => {
        return {
          ...user,
          role: this.getFakeRole(user.id)
        }
      }),
      tap(user => this.currentUserSignal.set(user))
    );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUserSignal.set(null);
  }


  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private getFakeRole(userId: number): UserRole {
    const adminIds = [1,2,3];
    return adminIds.includes(userId) ? "admin" : "user";
  }
}
