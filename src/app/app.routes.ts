// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Auth Guard
export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    return true;
  }
  
  router.navigate(['/auth/login']);
  return false;
};

// Guest Guard (redirect to dashboard if already authenticated)
export const guestGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
};

export const routes: Routes = [
  // Default redirect to auth
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  
  // Auth routes (lazy loaded)
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./auth.routes').then(m => m.authRoutes)
  },
  
  // Protected dashboard routes
  {
    path: 'dashboard',
    // canActivate: [authGuard],
    loadComponent: () => import('./dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'menu',
        loadComponent: () => import('./menu.component').then(m => m.MenuComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: 'staff',
        loadComponent: () => import('./staff.component').then(m => m.StaffComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  
  // Wildcard redirect
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];