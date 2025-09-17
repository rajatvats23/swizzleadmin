import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./login.component').then(m => m.LoginComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password/:token',
        loadComponent: () => import('./reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
        path: 'register/:token',
        loadComponent: () => import('./register.component').then(m => m.RegisterComponent)
      }
    ]
  }
];