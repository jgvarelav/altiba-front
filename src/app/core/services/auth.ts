import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, StrapiUser } from '../models/auth.model';

const JWT_KEY = 'altiba_jwt';
const USER_KEY = 'altiba_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _currentUser = signal<StrapiUser | null>(this.readStoredUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  get token(): string | null {
    return localStorage.getItem(JWT_KEY);
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/local/register`, {
        username,
        email,
        password,
      })
      .pipe(tap((response) => this.storeSession(response)));
  }

  login(identifier: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/local`, { identifier, password })
      .pipe(tap((response) => this.storeSession(response)));
  }

  /** Strapi always answers OK (even for unknown emails) so accounts can't be enumerated. */
  forgotPassword(email: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${environment.apiUrl}/api/auth/forgot-password`, {
      email,
    });
  }

  /** `code` comes from the link in the reset email; on success the user is logged in. */
  resetPassword(code: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/reset-password`, {
        code,
        password,
        passwordConfirmation: password,
      })
      .pipe(tap((response) => this.storeSession(response)));
  }

  logout(): void {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(JWT_KEY, response.jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this._currentUser.set(response.user);
  }

  private readStoredUser(): StrapiUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StrapiUser;
    } catch {
      return null;
    }
  }
}
