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
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  
  // Protected routes
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  
  // Wildcard redirect
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];