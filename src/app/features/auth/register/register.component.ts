// src/app/features/auth/register/register.component.ts
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      @if (!invalidToken()) {
        <div class="register-header">
          <h1 class="title">Complete Registration</h1>
          <p class="subtitle">Enter your details to get started</p>
        </div>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="name-row">
            <div class="form-field">
              <label for="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                formControlName="firstName"
                placeholder="Enter your first name"
                [class.error]="firstNameControl.invalid && (firstNameControl.dirty || firstNameControl.touched)"
              />
              @if (firstNameControl.invalid && (firstNameControl.dirty || firstNameControl.touched)) {
                <div class="field-error">First name is required</div>
              }
            </div>

            <div class="form-field">
              <label for="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                formControlName="lastName"
                placeholder="Enter your last name"
                [class.error]="lastNameControl.invalid && (lastNameControl.dirty || lastNameControl.touched)"
              />
              @if (lastNameControl.invalid && (lastNameControl.dirty || lastNameControl.touched)) {
                <div class="field-error">Last name is required</div>
              }
            </div>
          </div>

          <div class="phone-row">
            <div class="form-field country-code">
              <label for="countryCode">Country Code</label>
              <input
                id="countryCode"
                type="text"
                formControlName="countryCode"
                placeholder="+1"
                [class.error]="countryCodeControl.invalid && (countryCodeControl.dirty || countryCodeControl.touched)"
              />
              @if (countryCodeControl.invalid && (countryCodeControl.dirty || countryCodeControl.touched)) {
                <div class="field-error">Required</div>
              }
            </div>

            <div class="form-field phone-number">
              <label for="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                formControlName="phoneNumber"
                placeholder="Enter your phone number"
                [class.error]="phoneNumberControl.invalid && (phoneNumberControl.dirty || phoneNumberControl.touched)"
              />
              @if (phoneNumberControl.invalid && (phoneNumberControl.dirty || phoneNumberControl.touched)) {
                <div class="field-error">Phone number is required</div>
              }
            </div>
          </div>

          <div class="form-field">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input
                id="password"
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                placeholder="Create a password"
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

          <button
            type="submit"
            class="register-button"
            [disabled]="registerForm.invalid || submitting()"
          >
            {{ submitting() ? 'Processing...' : 'Complete Registration' }}
          </button>
        </form>
      } @else {
        <div class="invalid-token-container">
          <div class="register-header">
            <h1 class="title error">Invalid Registration Link</h1>
            <p class="subtitle">The registration link is invalid or has expired.</p>
          </div>

          <button
            type="button"
            class="back-button"
            (click)="router.navigate(['/auth/login'])"
          >
            Back to Login
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .register-container {
      width: 100%;
    }

    .register-header {
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .name-row,
    .phone-row {
      display: flex;
      gap: 1rem;
    }

    .name-row .form-field {
      flex: 1;
    }

    .phone-row .country-code {
      flex: 0 0 120px;
    }

    .phone-row .phone-number {
      flex: 1;
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
    }

    .password-wrapper input {
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

    .register-button,
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
      margin-top: 0.5rem;
    }

    .register-button:hover:not(:disabled),
    .back-button:hover {
      background-color: #007a3d;
    }

    .register-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .invalid-token-container {
      text-align: center;
    }

    @media (max-width: 768px) {
      .name-row,
      .phone-row {
        flex-direction: column;
        gap: 1rem;
      }

      .phone-row .country-code {
        flex: 1;
      }
    }

    @media (max-width: 480px) {
      .register-header {
        margin-bottom: 1.5rem;
      }

      .register-form {
        gap: 1.25rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  public router = inject(Router);

  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    countryCode: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submitting = signal(false);
  errorMessage = signal('');
  invalidToken = signal(false);
  hidePassword = signal(true);
  token = signal<string | null>(null);

  get firstNameControl() { return this.registerForm.get('firstName')!; }
  get lastNameControl() { return this.registerForm.get('lastName')!; }
  get countryCodeControl() { return this.registerForm.get('countryCode')!; }
  get phoneNumberControl() { return this.registerForm.get('phoneNumber')!; }
  get passwordControl() { return this.registerForm.get('password')!; }

  ngOnInit(): void {
    const tokenParam = this.route.snapshot.paramMap.get('token');
    if (!tokenParam) {
      this.invalidToken.set(true);
    } else {
      this.token.set(tokenParam);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.registerForm.invalid || !this.token()) return;

    this.submitting.set(true);
    this.errorMessage.set('');

    const { firstName, lastName, countryCode, phoneNumber, password } = this.registerForm.value;

    const formData: RegisterRequest = {
      firstName: firstName!,
      lastName: lastName!,
      countryCode: countryCode!,
      phoneNumber: phoneNumber!,
      password: password!
    };

    this.authService.register(this.token()!, formData).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
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