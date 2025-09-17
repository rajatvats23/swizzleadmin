// src/app/core/services/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

// Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'superadmin' | 'admin' | 'manager' | 'staff';
    countryCode: string;
    phoneNumber: string;
    token?: string;
    restaurantId?: string;
    requireMfa?: boolean;
    mfaSetupRequired?: boolean;
    tempToken?: string;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  password: string;
  countryCode: string;
  phoneNumber: string;
}

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpService);
  private router = inject(Router);

  private _user = signal<any>(null);
  private _token = signal<string | null>(null);
  private _isAuthenticated = computed(() => !!this._token());

  get user() { return this._user.asReadonly(); }
  get isAuthenticated() { return this._isAuthenticated; }

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user_info');

    if (token && user) {
      this._token.set(token);
      this._user.set(JSON.parse(user));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', credentials).pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          if (response.data.requireMfa) {
            // Store temp user data for MFA flow
            localStorage.setItem('mfa_temp_user', JSON.stringify(response.data));
            if (response.data.tempToken) {
              localStorage.setItem('auth_token', response.data.tempToken);
            }
          } else if (response.data.token) {
            // Normal login flow
            this.setAuthData(response.data.token, response.data);
          }
        }
      })
    );
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('/auth/forgot-password', { email });
  }

  resetPassword(token: string, password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`/auth/reset-password/${token}`, { password });
  }

  register(token: string, userData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/auth/register/${token}`, userData).pipe(
      tap(response => {
        if (response.status === 'success' && response.data?.token) {
          this.setAuthData(response.data.token, response.data);
        }
      })
    );
  }

  private setAuthData(token: string, userData: any): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_info', JSON.stringify(userData));
    this._token.set(token);
    this._user.set(userData);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('mfa_temp_user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  // MFA methods
  getMfaSetup(): Observable<any> {
    return this.http.get('/mfa/setup');
  }

  verifyMfaSetup(code: string): Observable<any> {
    return this.http.post<ApiResponse<{ token: string }>>('/mfa/verify-setup', { code }).pipe(
      tap(response => {
        if (response.status === 'success' && response.data?.token) {
          const tempUser = this.getTempUserInfo();
          if (tempUser) {
            this.setAuthData(response.data.token, tempUser);
            localStorage.removeItem('mfa_temp_user');
          }
        }
      })
    );
  }

  verifyMfaLogin(code: string): Observable<any> {
    const tempUser = this.getTempUserInfo();
    return this.http.post<ApiResponse<{ token: string }>>('/mfa/verify', { 
      userId: tempUser?._id, 
      code 
    }).pipe(
      tap(response => {
        if (response.status === 'success' && response.data?.token) {
          if (tempUser) {
            this.setAuthData(response.data.token, tempUser);
            localStorage.removeItem('mfa_temp_user');
          }
        }
      })
    );
  }

  getTempUserInfo(): any {
    const tempUser = localStorage.getItem('mfa_temp_user');
    return tempUser ? JSON.parse(tempUser) : null;
  }

  isMfaRequired(): boolean {
    return !!localStorage.getItem('mfa_temp_user');
  }
}