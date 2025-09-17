// src/app/features/auth/register/register.component.ts
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, RegisterRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      @if (!invalidToken()) {
        <div class="register-header">
          <h1 class="title">
            <mat-icon class="title-icon">person_add</mat-icon>
            Complete Registration
          </h1>
          <p class="subtitle">Enter your details to get started</p>
        </div>

        @if (errorMessage()) {
          <mat-card class="error-card">
            <mat-icon class="error-icon">error</mat-icon>
            {{ errorMessage() }}
          </mat-card>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="name-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" placeholder="Enter your first name">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="firstNameControl.hasError('required')">First name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" placeholder="Enter your last name">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="lastNameControl.hasError('required')">Last name is required</mat-error>
            </mat-form-field>
          </div>

          <div class="phone-row">
            <mat-form-field appearance="outline" class="country-code">
              <mat-label>Country Code</mat-label>
              <input matInput formControlName="countryCode" placeholder="+1">
              <mat-icon matSuffix>flag</mat-icon>
              <mat-error *ngIf="countryCodeControl.hasError('required')">Required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="phone-number">
              <mat-label>Phone Number</mat-label>
              <input matInput formControlName="phoneNumber" type="tel" placeholder="Enter your phone number">
              <mat-icon matSuffix>phone</mat-icon>
              <mat-error *ngIf="phoneNumberControl.hasError('required')">Phone number is required</mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" placeholder="Create a password">
            <button matSuffix mat-icon-button type="button" (click)="togglePasswordVisibility()">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="passwordControl.hasError('required')">Password is required</mat-error>
            <mat-error *ngIf="passwordControl.hasError('minlength')">Password must be at least 8 characters</mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" class="register-button" [disabled]="registerForm.invalid || submitting()">
            @if (submitting()) {
              <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
            }
            {{ submitting() ? 'Processing...' : 'Complete Registration' }}
          </button>
        </form>
      } @else {
        <div class="invalid-token-container">
          <div class="register-header">
            <h1 class="title error">
              <mat-icon class="title-icon">link_off</mat-icon>
              Invalid Registration Link
            </h1>
            <p class="subtitle">The registration link is invalid or has expired.</p>
          </div>

          <button mat-raised-button color="primary" (click)="router.navigate(['/auth/login'])" class="back-button">
            <mat-icon>arrow_back</mat-icon>
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

    .invalid-token-container .register-header {
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .name-row,
    .phone-row {
      display: flex;
      gap: 1rem;
    }

    .name-row mat-form-field {
      flex: 1;
    }

    .phone-row .country-code {
      flex: 0 0 140px;
    }

    .phone-row .phone-number {
      flex: 1;
    }

    .register-button,
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