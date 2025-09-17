// src/app/features/auth/forgot-password/forgot-password.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="forgot-password-container">
      @if (!emailSent()) {
        <div class="forgot-header">
          <h1 class="title">
            <mat-icon class="title-icon">lock_reset</mat-icon>
            Forgot Password
          </h1>
          <p class="subtitle">Enter the email address associated with your account</p>
        </div>

        @if (errorMessage()) {
          <mat-card class="error-card">
            <mat-icon class="error-icon">error</mat-icon>
            {{ errorMessage() }}
          </mat-card>
        }

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="forgot-form">
          <mat-form-field appearance="outline">
            <mat-label>Email Address</mat-label>
            <input matInput formControlName="email" type="email" placeholder="name@example.com">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="emailControl.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="emailControl.hasError('email')">Please enter a valid email</mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" class="reset-button" [disabled]="forgotForm.invalid || submitting()">
            @if (submitting()) {
              <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
            }
            {{ submitting() ? 'Sending...' : 'Reset Password' }}
          </button>
        </form>

        <div class="back-link">
          <button mat-button routerLink="/auth/login" color="primary">
            <mat-icon>arrow_back</mat-icon>
            Back to Login
          </button>
        </div>
      } @else {
        <div class="success-container">
          <div class="forgot-header">
            <h1 class="title success">
              <mat-icon class="title-icon">mark_email_read</mat-icon>
              Check your Email
            </h1>
            <p class="subtitle">
              We have sent a password reset link to<br />
              <strong>{{ sentEmail() }}</strong>
            </p>
          </div>

          <button mat-raised-button color="primary" routerLink="/auth/login" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Back to Login
          </button>

          <div class="resend-section">
            <p>Didn't receive the email?</p>
            <button mat-button color="warn" (click)="resendEmail()">
              <mat-icon>refresh</mat-icon>
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

    .success-container .forgot-header {
      text-align: center;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 500;
      color: #dc3545;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title.success {
      color: #009c4c;
      justify-content: center;
    }

    .title-icon {
      font-size: 1.5rem;
    }

    .subtitle {
      font-size: 1rem;
      color: #666;
      margin: 0;
      line-height: 1.4;
    }

    .error-card {
      background-color: #fdf2f2;
      color: #dc3545;
      margin-bottom: 1.5rem;
      padding: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .error-icon {
      color: #dc3545;
    }

    .forgot-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .reset-button,
    .back-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
    }

    .button-spinner {
      margin-right: 8px;
    }

    .back-link {
      text-align: center;
    }

    .success-container {
      text-align: center;
    }

    .resend-section {
      margin-top: 1.5rem;
      text-align: center;
    }

    .resend-section p {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: #666;
    }

    mat-form-field {
      width: 100%;
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