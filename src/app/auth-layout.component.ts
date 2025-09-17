import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-background"></div>
      <div class="auth-content">
        <div class="auth-card">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow: hidden; /* Prevent scrollbars */
    }

    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff8eb;
      background-image: url('/assets/auth_bcg.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 0;
    }

    .auth-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 400px; /* Reduced from 450px */
      margin-left: auto;
      margin-right: 5%;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      padding: 1.5rem; /* Reduced from 2rem */
      width: 100%;
      max-height: 90vh; /* Prevent vertical overflow */
      overflow-y: auto; /* Only scroll if content is too tall */
    }

    @media (max-width: 768px) {
      .auth-content {
        margin-right: auto;
        margin-left: auto;
        max-width: 360px; /* Reduced */
      }
      
      .auth-card {
        padding: 1.25rem; /* Reduced */
      }
    }

    @media (max-width: 480px) {
      .auth-layout {
        padding: 0.5rem;
      }
      
      .auth-content {
        max-width: 100%;
      }
      
      .auth-card {
        padding: 1rem;
        border-radius: 8px;
      }
    }
  `]
})
export class AuthLayoutComponent {}