// src/app/features/auth/login/login.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-header">
        <h1 class="welcome-title">Welcome!</h1>
        <p class="signin-subtitle">Sign in to Get Started</p>
      </div>

      @if (errorMessage()) {
        <div class="error-message">
          <mat-icon>error</mat-icon>
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        <mat-form-field appearance="outline">
          <mat-label>Email Address</mat-label>
          <input matInput formControlName="email" type="email" placeholder="name@example.com">
          <mat-icon matSuffix>email</mat-icon>
          <mat-error *ngIf="emailControl.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="emailControl.hasError('email')">Please enter a valid email</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" placeholder="Enter your password">
          <button matSuffix mat-icon-button type="button" (click)="togglePasswordVisibility()">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="passwordControl.hasError('required')">Password is required</mat-error>
        </mat-form-field>

        <div class="forgot-password">
          <a mat-button routerLink="/auth/forgot-password" color="warn">Forgot Password?</a>
        </div>

        <button mat-raised-button color="primary" type="submit" class="signin-button" [disabled]="loginForm.invalid || submitting()">
          @if (submitting()) {
            <mat-spinner diameter="20"></mat-spinner>
          }
          {{ submitting() ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Need access? Contact your restaurant administrator</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      width: 100%;
    }

    .login-header {
      text-align: left;
      margin-bottom: 2rem;
    }

    .welcome-title {
      font-size: 1.5rem;
      font-weight: 500;
      color: #009c4c;
      margin: 0 0 0.5rem 0;
    }

    .signin-subtitle {
      font-size: 1rem;
      color: #666;
      margin: 0;
    }

    .error-message {
      background-color: #fdf2f2;
      color: #dc3545;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      border: 1px solid #fecaca;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .forgot-password {
      text-align: right;
      margin: -0.5rem 0 1rem 0;
    }

    .signin-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e1e5e9;
    }

    .auth-footer p {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
    }

    mat-form-field {
      width: 100%;
    }

    mat-spinner {
      margin-right: 8px;
    }

    /* Custom Material theme colors */
    ::ng-deep .mat-mdc-raised-button.mat-primary {
      --mdc-protected-button-container-color: #009c4c;
      --mdc-protected-button-label-text-color: white;
    }

    ::ng-deep .mat-mdc-raised-button.mat-primary:hover {
      --mdc-protected-button-container-color: #007a3d;
    }

    ::ng-deep .mat-mdc-outlined-text-field.mdc-text-field--focused .mdc-notched-outline__leading,
    ::ng-deep .mat-mdc-outlined-text-field.mdc-text-field--focused .mdc-notched-outline__notch,
    ::ng-deep .mat-mdc-outlined-text-field.mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: #009c4c;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-floating-label {
      color: #009c4c;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  hidePassword = signal(true);
  submitting = signal(false);
  errorMessage = signal('');

  get emailControl() { return this.loginForm.get('email')!; }
  get passwordControl() { return this.loginForm.get('password')!; }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (response) => {
        if (response.data.requireMfa) {
          this.router.navigate(['/auth/mfa-verify']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage.set(error);
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }
}