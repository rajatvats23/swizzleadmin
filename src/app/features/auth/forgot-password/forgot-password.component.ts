// src/app/features/auth/forgot-password/forgot-password.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="forgot-password-container">
      @if (!emailSent()) {
        <div class="forgot-header">
          <h1 class="title">Forgot Password</h1>
          <p class="subtitle">Enter the email address associated with your account</p>
        </div>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="forgot-form">
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

          <button
            type="submit"
            class="reset-button"
            [disabled]="forgotForm.invalid || submitting()"
          >
            {{ submitting() ? 'Sending...' : 'Reset Password' }}
          </button>
        </form>

        <div class="back-link">
          <a routerLink="/auth/login">Back to Login</a>
        </div>
      } @else {
        <div class="success-container">
          <div class="forgot-header">
            <h1 class="title">Check your Email</h1>
            <p class="subtitle">
              We have sent a password reset link to<br />
              <strong>{{ sentEmail() }}</strong>
            </p>
          </div>

          <button
            type="button"
            class="back-button"
            routerLink="/auth/login"
          >
            Back to Login
          </button>

          <div class="resend-section">
            <p>Didn't receive the email?</p>
            <button type="button" class="resend-link" (click)="resendEmail()">
              Click to resend
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .forgot-password-container {
      width: 100%;
    }

    .forgot-header {
      text-align: left;
      margin-bottom: 2rem;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 500;
      color: #dc3545;
      margin: 0 0 0.5rem 0;
      font-family: 'Inter', sans-serif;
    }

    .subtitle {
      font-size: 1rem;
      color: #666;
      margin: 0;
      font-family: 'Inter', sans-serif;
      line-height: 1.4;
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

    .forgot-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
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

    .field-error {
      font-size: 0.75rem;
      color: #dc3545;
      margin-top: 0.25rem;
    }

    .reset-button,
    .back-button {
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

    .reset-button:hover:not(:disabled),
    .back-button:hover {
      background-color: #007a3d;
    }

    .reset-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .back-link {
      text-align: center;
    }

    .back-link a {
      font-size: 0.875rem;
      color: #666;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
    }

    .back-link a:hover {
      color: #009c4c;
      text-decoration: underline;
    }

    .success-container {
      text-align: center;
    }

    .success-container .forgot-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .success-container .title {
      color: #009c4c;
    }

    .resend-section {
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: #666;
    }

    .resend-section p {
      margin: 0 0 0.5rem 0;
    }

    .resend-link {
      background: none;
      border: none;
      color: #dc3545;
      text-decoration: underline;
      cursor: pointer;
      font-size: 0.875rem;
      font-family: 'Inter', sans-serif;
    }

    .resend-link:hover {
      color: #b52d3a;
    }

    @media (max-width: 480px) {
      .forgot-header {
        margin-bottom: 1.5rem;
      }

      .forgot-form {
        gap: 1.25rem;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submitting = signal(false);
  errorMessage = signal('');
  emailSent = signal(false);
  sentEmail = signal('');

  get emailControl() { return this.forgotForm.get('email')!; }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set('');

    const { email } = this.forgotForm.value;

    this.authService.forgotPassword(email!).subscribe({
      next: () => {
        this.emailSent.set(true);
        this.sentEmail.set(email!);
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

  resendEmail(): void {
    if (this.sentEmail()) {
      this.forgotForm.patchValue({ email: this.sentEmail() });
      this.emailSent.set(false);
    }
  }
}