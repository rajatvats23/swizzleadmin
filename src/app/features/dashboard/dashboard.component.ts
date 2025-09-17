// src/app/features/dashboard/dashboard.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {{ user()?.firstName || 'User' }}!</p>
      </div>

      <div class="dashboard-cards">
        @for (card of cards(); track card.title) {
          <mat-card class="dashboard-card">
            <div class="card-content">
              <div class="card-info">
                <span class="card-value">{{ card.value }}</span>
                <span class="card-title">{{ card.title }}</span>
              </div>
              <div class="card-icon" [style.background-color]="card.color">
                <mat-icon>{{ card.icon }}</mat-icon>
              </div>
            </div>
          </mat-card>
        }
      </div>

      <div class="dashboard-content">
        <mat-card class="content-card">
          <h2>Quick Actions</h2>
          <p>Your restaurant management tools are ready to use.</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 1.5rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 1.75rem;
      font-weight: 600;
      color: #009c4c;
      margin: 0 0 0.25rem 0;
      font-family: 'Montserrat', sans-serif;
    }

    .page-header p {
      color: #666;
      margin: 0;
      font-family: 'Montserrat', sans-serif;
    }

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .card-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .card-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #009c4c;
      font-family: 'Montserrat', sans-serif;
    }

    .card-title {
      font-size: 0.875rem;
      color: #666;
      font-family: 'Montserrat', sans-serif;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-icon mat-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .dashboard-content {
      display: grid;
      gap: 1rem;
    }

    .content-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .content-card h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #009c4c;
      margin: 0 0 0.5rem 0;
      font-family: 'Montserrat', sans-serif;
    }

    .content-card p {
      color: #666;
      margin: 0;
      font-family: 'Montserrat', sans-serif;
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);

  user = this.authService.user;

  cards = signal<DashboardCard[]>([
    { title: 'Total Orders', value: '156', icon: 'receipt_long', color: '#009c4c' },
    { title: 'Menu Items', value: '42', icon: 'restaurant_menu', color: '#ff9800' },
    { title: 'Staff Members', value: '8', icon: 'people', color: '#2196f3' },
    { title: 'Monthly Revenue', value: '$12.4k', icon: 'trending_up', color: '#4caf50' }
  ]);
}