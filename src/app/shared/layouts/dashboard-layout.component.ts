import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2 class="app-title">Swizzle</h2>
        </div>
        
        <nav class="sidebar-nav">
          @for (item of navItems(); track item.path) {
            <a 
              [routerLink]="item.path" 
              routerLinkActive="active"
              class="nav-item"
              [routerLinkActiveOptions]="{exact: item.path === '/dashboard'}"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <button mat-button class="logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 240px;
      background-color: #009c4c;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .sidebar-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .app-title {
      color: white;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      font-family: 'Montserrat', sans-serif;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: white;
      text-decoration: none;
      transition: all 0.2s ease;
      margin: 0 0.5rem;
      border-radius: 8px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-item.active {
      background-color: white;
      color: #009c4c;
    }

    .nav-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      width: 100%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
    }

    .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .logout-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .main-content {
      flex: 1;
      background-color: #faf9f6;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 200px;
      }
    }

    @media (max-width: 640px) {
      .sidebar {
        position: absolute;
        z-index: 1000;
        height: 100vh;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .main-content {
        width: 100%;
      }
    }
  `]
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  navItems = signal<NavItem[]>([
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/dashboard/orders', icon: 'receipt_long', label: 'Orders' },
    { path: '/dashboard/menu', icon: 'restaurant_menu', label: 'Menu' },
    { path: '/dashboard/inventory', icon: 'inventory_2', label: 'Inventory' },
    { path: '/dashboard/staff', icon: 'people', label: 'Staff' },
    { path: '/dashboard/analytics', icon: 'analytics', label: 'Analytics' },
    { path: '/dashboard/settings', icon: 'settings', label: 'Settings' }
  ]);

  logout(): void {
    this.authService.logout();
  }
}