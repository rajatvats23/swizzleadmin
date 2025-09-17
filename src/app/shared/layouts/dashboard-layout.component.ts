import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
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
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  template: `
    <div class="dashboard-layout">
      <!-- Animated Background -->
      <div class="animated-background"></div>

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="/assets/logo_light.svg" alt="Swizzle" class="logo-img" />
        </div>

        <nav class="sidebar-nav">
          @for (item of navItems(); track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="active"
            class="nav-item"
            [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
          >
            <mat-icon>{{ item.icon }}</mat-icon>
            <span>{{ item.label }}</span>
          </a>
          }
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <header class="header">
          <div class="header-right">
            <button
              mat-icon-button
              [matBadge]="3"
              matBadgeColor="warn"
              class="notification-btn"
            >
              <mat-icon>notifications</mat-icon>
            </button>

            <button
              mat-icon-button
              [matMenuTriggerFor]="userMenu"
              class="user-avatar"
            >
              <mat-icon>account_circle</mat-icon>
            </button>

            <mat-menu #userMenu="matMenu">
              <button mat-menu-item>
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard-layout {
        display: flex;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
          sans-serif;
        position: relative;
        background: transparent !important;
      }

      .animated-background {
        position: absolute;
        filter: opacity(0.15);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff8eb;
        background-image: url('/assets/layout-bg.png');
        background-size: 400px; /* Make it smaller - adjust this value */
        background-position: center;
        background-repeat: repeat; /* Make it repeat */
        z-index: 0;
      }

      .sidebar {
        width: 200px;
        background: #009c4c;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        // box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
        position: relative;
        z-index: 10;
      }

      .sidebar-header {
        padding: 1rem 1.25rem;
        align-self: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .logo-img {
        height: 35px;
        width: auto;
      }

      .sidebar-nav {
        flex: 1;
        padding: 0.75rem 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: 0.625rem 1.25rem;
        margin: 0 0.5rem;
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.85);
        text-decoration: none;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 400;
        font-size: 1rem;
        letter-spacing: 0.01em;
      }

      .nav-item:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: white;
        transform: translateX(2px);
      }

      .nav-item.active {
        background-color: rgba(255, 255, 255, 0.12);
        color: white;
        font-weight: 500;
      }

      .nav-item mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        z-index: 5;
      }

      .header {
        background: #009c4c;
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(229, 231, 235, 0.5);
        padding: 0 1.5rem;
        height: 48px;
        display: flex;
        color: white;
        align-items: center;
        justify-content: flex-end;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .notification-btn,
      .user-avatar {
        color: white;
        width: 36px;
        height: 36px;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      .notification-btn:hover,
      .user-avatar:hover {
        // background-color:
        color:  rgba(249, 250, 251, 0.8);;
      }

      .page-content {
        flex: 1;
        background-color: transparent;
        overflow-y: auto;
      }

      /* Menu styling overrides */
      ::ng-deep .mat-mdc-menu-panel {
        background-color: white;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-top: 4px;
      }

      ::ng-deep .mat-mdc-menu-item {
        color: #374151;
        font-size: 0.8125rem;
        min-height: 36px;
        padding: 0 12px;
      }

      ::ng-deep .mat-mdc-menu-item:hover {
        background-color: #f9fafb;
      }

      ::ng-deep .mat-mdc-menu-item mat-icon {
        color: #6b7280;
        margin-right: 0.5rem;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      ::ng-deep .mat-badge-content {
        font-size: 10px;
        font-weight: 600;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }

      @media (max-width: 768px) {
        .sidebar {
          width: 180px;
        }

        .nav-item {
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
        }

        .animated-background {
          background-size: cover;
        }
      }

      @media (max-width: 640px) {
        .sidebar {
          position: absolute;
          z-index: 1000;
          height: 100vh;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .main-content {
          width: 100%;
        }
      }

      /* Performance optimizations */
      .animated-background {
        will-change: transform;
        transform: translateZ(0); /* Force hardware acceleration */
      }

      /* Reduced motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        .animated-background {
          animation-duration: 120s; /* Slower animation */
        }
      }
    `,
  ],
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
    { path: '/dashboard/settings', icon: 'settings', label: 'Settings' },
  ]);

  logout(): void {
    this.authService.logout();
  }
}
