import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { authGuard } from './auth/guards/auth.guard';
import { MainLayout } from './core/components/main-layout/main-layout';
import { coreRoutes } from './core/core.routes';
import { reportRoutes } from './reports/report.routes';
import { rolesRoutes } from './roles/roles.routes';
import { usersRoutes } from './users/users.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'app/home', pathMatch: 'full' },
  ...authRoutes,
  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      ...coreRoutes,
      ...rolesRoutes,
      ...usersRoutes,
      ...reportRoutes,
    ],
  },
];
