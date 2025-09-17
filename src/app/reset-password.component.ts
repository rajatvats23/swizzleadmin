// src/app/features/auth/reset-password/reset-password.component.ts
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-reset-password',
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
    <div class="reset-password-container">
      @if (!invalidToken()) {
        <div class="reset-header">
          <h1 class="title">
            <mat-icon class="title-icon">lock_reset</mat-icon>
            Set New Password
          </h1>
          <p class="subtitle">Type your new password below</p>
        </div>

        @if (errorMessage()) {
          <mat-card class="error-card">
            <mat-icon class="error-icon">error</mat-icon>
            {{ errorMessage() }}
          </mat-card>
        }

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="reset-form">
          <mat-form-field appearance="outline">
            <mat-label>New Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" placeholder="Enter your new password">
            <button matSuffix mat-icon-button type="button" (click)="togglePasswordVisibility()">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="passwordControl.hasError('required')">Password is required</mat-error>
            <mat-error *ngIf="passwordControl.hasError('minlength')">Password must be at least 8 characters</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm Password</mat-label>
            <input matInput formControlName="confirmPassword" [type]="hideConfirmPassword() ? 'password' : 'text'" placeholder="Confirm your new password">
            <button matSuffix mat-icon-button type="button" (click)="toggleConfirmPasswordVisibility()">
              <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="confirmPasswordControl.hasError('required')">Confirm password is required</mat-error>
            <mat-error *ngIf="resetForm.hasError('passwordMismatch') && confirmPasswordControl.touched">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" class="reset-button" [disabled]="resetForm.invalid || submitting()">
            @if (submitting()) {
              <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
            }
            {{ submitting() ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      } @else {
        <div class="invalid-token-container">
          <div class="reset-header">
            <h1 class="title error">
              <mat-icon class="title-icon">link_off</mat-icon>
              Invalid Reset Link
            </h1>
            <p class="subtitle">The password reset link is invalid or has expired.</p>
          </div>

          <button mat-raised-button color="primary" routerLink="/auth/login" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Back to Login
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .reset-password-container {
      width: 100%;
    }

    .reset-header {
      text-align: left;
      margin-bottom: 2rem;
    }

    .invalid-token-container .reset-header {
      text-align: center;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 500;
      color: #009c4c;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title.error {
      color: #dc3545;
      justify-content: center;
    }

    .title-icon {
      font-size: 1.5rem;
    }

    .subtitle {
      font-size: 1rem;
      color: #666;
      margin: 0;
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

    .reset-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .reset-button,
    .back-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
      margin-top: 0.5rem;
    }

    .button-spinner {
      margin-right: 8px;
    }

    .invalid-token-container {
      text-align: center;
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
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  submitting = signal(false);
  errorMessage = signal('');
  invalidToken = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  token = signal<string | null>(null);

  get passwordControl() { return this.resetForm.get('password')!; }
  get confirmPasswordControl() { return this.resetForm.get('confirmPassword')!; }

  ngOnInit(): void {
    const tokenParam = this.route.snapshot.paramMap.get('token');
    if (!tokenParam) {
      this.invalidToken.set(true);
    } else {
      this.token.set(tokenParam);
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token()) return;

    this.submitting.set(true);
    this.errorMessage.set('');

    const { password } = this.resetForm.value;

    this.authService.resetPassword(this.token()!, password!).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: { message: 'Password reset successfully' }
        });
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