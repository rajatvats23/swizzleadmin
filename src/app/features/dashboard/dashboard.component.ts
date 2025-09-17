import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Restaurant Dashboard</h1>
        <button (click)="logout()" class="logout-btn">Logout</button>
      </header>
      
      <div class="dashboard-content">
        <div class="welcome-card">
          <h2>Welcome to Swizzle Admin</h2>
          <p>Your restaurant management system is ready!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background-color: #fff8eb;
    }

    .dashboard-header {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #009c4c;
      font-family: 'Inter', sans-serif;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
    }

    .logout-btn:hover {
      background-color: #c82333;
    }

    .dashboard-content {
      padding: 2rem;
    }

    .welcome-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .welcome-card h2 {
      margin: 0 0 1rem 0;
      color: #009c4c;
      font-family: 'Inter', sans-serif;
    }

    .welcome-card p {
      margin: 0;
      color: #666;
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class DashboardComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/auth/login']);
  }
}