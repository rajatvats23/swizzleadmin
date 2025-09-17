// src/app/features/auth/reset-password/reset-password.component.ts
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="reset-password-container">
      @if (!invalidToken()) {
        <div class="reset-header">
          <h1 class="title">Set New Password</h1>
          <p class="subtitle">Type your new password below</p>
        </div>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="reset-form">
          <div class="form-field">
            <label for="password">New Password</label>
            <div class="password-wrapper">
              <input
                id="password"
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                placeholder="Enter your new password"
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
                @if (passwordControl.hasError('required')) {
                  Password is required
                } @else if (passwordControl.hasError('minlength')) {
                  Password must be at least 8 characters
                }
              </div>
            }
          </div>

          <div class="form-field">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-wrapper">
              <input
                id="confirmPassword"
                [type]="hideConfirmPassword() ? 'password' : 'text'"
                formControlName="confirmPassword"
                placeholder="Confirm your new password"
                [class.error]="confirmPasswordControl.invalid && (confirmPasswordControl.dirty || confirmPasswordControl.touched)"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="toggleConfirmPasswordVisibility()"
              >
                <span class="material-symbols-outlined">
                  {{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            @if (confirmPasswordControl.invalid && (confirmPasswordControl.dirty || confirmPasswordControl.touched)) {
              <div class="field-error">
                @if (confirmPasswordControl.hasError('required')) {
                  Confirm password is required
                }
              </div>
            }
            @if (resetForm.hasError('passwordMismatch') && confirmPasswordControl.touched) {
              <div class="field-error">
                Passwords do not match
              </div>
            }
          </div>

          <button
            type="submit"
            class="reset-button"
            [disabled]="resetForm.invalid || submitting()"
          >
            {{ submitting() ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      } @else {
        <div class="invalid-token-container">
          <div class="reset-header">
            <h1 class="title error">Invalid Reset Link</h1>
            <p class="subtitle">The password reset link is invalid or has expired.</p>
          </div>

          <button
            type="button"
            class="back-button"
            routerLink="/auth/login"
          >
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

    .title {
      font-size: 1.5rem;
      font-weight: 500;
      color: #009c4c;
      margin: 0 0 0.5rem 0;
      font-family: 'Inter', sans-serif;
    }

    .title.error {
      color: #dc3545;
    }

    .subtitle {
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

    .reset-form {
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

    .password-wrapper {
      position: relative;
    }

    .form-field input {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      font-family: 'Inter', sans-serif;
      width: 100%;
      padding-right: 2.5rem;
    }

    .form-field input:focus {
      outline: none;
      border-color: #009c4c;
    }

    .form-field input.error {
      border-color: #dc3545;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
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

    .invalid-token-container {
      text-align: center;
    }

    @media (max-width: 480px) {
      .reset-header {
        margin-bottom: 1.5rem;
      }

      .reset-form {
        gap: 1.25rem;
      }
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