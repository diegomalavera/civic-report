import { Routes } from '@angular/router';
import { EmptyLayout } from '../core/components/empty-layout/empty-layout';

export const authRoutes: Routes = [
  {
    path: 'auth',
    component: EmptyLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login').then((c) => c.Login),
      },
      {
        path: 'register-password',
        loadComponent: () =>
          import('./components/register-password/register-password').then(
            (c) => c.RegisterPassword
          ),
      },
      {
        path: 'register-data',
        loadComponent: () =>
          import('./components/register-data/register-data').then((c) => c.RegisterData),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./components/change-password/change-password').then((c) => c.ChangePassword),
      },
      {
        path: 'validate-email',
        loadComponent: () =>
          import('./components/validate-email/validate-email').then((c) => c.ValidateEmail),
      },
      {
        path: 'validate-otp',
        loadComponent: () =>
          import('./components/validate-otp/validate-otp').then((c) => c.ValidateOtp),
      },
    ],
  },
];
