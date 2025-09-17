// src/app/features/auth/login/login.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-header">
        <h1 class="welcome-title">Welcome!</h1>
        <p class="signin-subtitle">Sign in to Get Started</p>
      </div>

      @if (errorMessage()) {
        <div class="error-message">{{ errorMessage() }}</div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-field">
          <label for="email">Email Address</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="name@example.com"
            [class.error]="emailControl.invalid && (emailControl.dirty || emailControl.touched)"
          />
          @if (emailControl.invalid && (emailControl.dirty || emailControl.touched)) {
            <div class="field-error">
              @if (emailControl.hasError('required')) {
                Email is required
              } @else if (emailControl.hasError('email')) {
                Please enter a valid email address
              }
            </div>
          }
        </div>

        <div class="form-field">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input
              id="password"
              [type]="hidePassword() ? 'password' : 'text'"
              formControlName="password"
              placeholder="Enter your password"
              [class.error]="passwordControl.invalid && (passwordControl.dirty || passwordControl.touched)"
            />
            <button
              type="button"
              class="password-toggle"
              (click)="togglePasswordVisibility()"
            >
              <span class="material-symbols-outlined">
                {{ hidePassword() ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
          @if (passwordControl.invalid && (passwordControl.dirty || passwordControl.touched)) {
            <div class="field-error">
              Password is required
            </div>
          }
        </div>

        <div class="forgot-password">
          <a routerLink="/auth/forgot-password" class="forgot-link">Forgot Password</a>
        </div>

        <button
          type="submit"
          class="signin-button"
          [disabled]="loginForm.invalid || submitting()"
        >
          {{ submitting() ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
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
      font-family: 'Inter', sans-serif;
    }

    .signin-subtitle {
      font-size: 1rem;
      color: #666;
      margin: 0;
      font-family: 'Inter', sans-serif;
    }

    .error-message {
      background-color: #fdf2f2;
      color: #dc3545;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      border: 1px solid #fecaca;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
      font-family: 'Inter', sans-serif;
    }

    .form-field input {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      font-family: 'Inter', sans-serif;
    }

    .form-field input:focus {
      outline: none;
      border-color: #009c4c;
    }

    .form-field input.error {
      border-color: #dc3545;
    }

    .password-wrapper {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .field-error {
      font-size: 0.75rem;
      color: #dc3545;
      margin-top: 0.25rem;
    }

    .forgot-password {
      text-align: right;
    }

    .forgot-link {
      font-size: 0.875rem;
      color: #dc3545;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .signin-button {
      width: 100%;
      padding: 0.875rem;
      background-color: #009c4c;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-family: 'Inter', sans-serif;
    }

    .signin-button:hover:not(:disabled) {
      background-color: #007a3d;
    }

    .signin-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    @media (max-width: 480px) {
      .login-header {
        margin-bottom: 1.5rem;
      }

      .login-form {
        gap: 1.25rem;
      }
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