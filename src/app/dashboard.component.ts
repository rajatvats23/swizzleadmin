import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="dashboard-page">
      <div class="welcome-section">
        <h1>Dashboard</h1>
        <p>Welcome back, User!</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon green">
            <mat-icon>receipt</mat-icon>
          </div>
          <div class="stat-info">
            <h3>156</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <mat-icon>restaurant</mat-icon>
          </div>
          <div class="stat-info">
            <h3>42</h3>
            <p>Menu Items</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-info">
            <h3>8</h3>
            <p>Staff Members</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green-light">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-info">
            <h3>$12.4k</h3>
            <p>Monthly Revenue</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <p>Your restaurant management tools are ready to use.</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 1.5rem 2rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 1400px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 1.75rem;
    }

    .welcome-section h1 {
      font-size: 1.625rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
      letter-spacing: -0.025em;
    }

    .welcome-section p {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
      font-weight: 400;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.25rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 0.875rem;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
      border-color: #d1d5db;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .stat-icon.green { background-color: #009c4c; }
    .stat-icon.orange { background-color: #ea580c; }
    .stat-icon.blue { background-color: #2563eb; }
    .stat-icon.green-light { background-color: #059669; }

    .stat-info h3 {
      font-size: 1.375rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.125rem 0;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .stat-info p {
      color: #6b7280;
      margin: 0;
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .quick-actions h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
      letter-spacing: -0.015em;
    }

    .quick-actions p {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .dashboard-page {
        padding: 1rem 1.25rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      
      .stat-card {
        padding: 1rem;
      }
      
      .welcome-section h1 {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .dashboard-page {
        padding: 1rem;
      }
      
      .stat-card {
        gap: 0.75rem;
      }
      
      .stat-icon {
        width: 36px;
        height: 36px;
      }
      
      .stat-icon mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      
      .stat-info h3 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class DashboardComponent {}