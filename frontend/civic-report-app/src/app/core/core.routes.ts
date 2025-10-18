import { Routes } from '@angular/router';

export const coreRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then((c) => c.Home),
  },
  {
    path: 'account',
    loadComponent: () => import('./components/account/account').then((c) => c.Account),
  },
];
