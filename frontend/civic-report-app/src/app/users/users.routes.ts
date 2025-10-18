import { Routes } from '@angular/router';
import { permissionGuard } from '../auth/guards/permissions.guard';

export const usersRoutes: Routes = [
  {
    path: 'users',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadComponent: () => import('./components/users-list/users-list').then((c) => c.UsersList),
        canActivate: [permissionGuard(['users_read'])],
      },
      {
        path: 'create',
        loadComponent: () => import('./components/user-form/user-form').then((c) => c.UserForm),
        canActivate: [permissionGuard(['users_create'])],
      },
      {
        path: 'update/:id',
        loadComponent: () => import('./components/user-form/user-form').then((c) => c.UserForm),
        canActivate: [permissionGuard(['users_update'])],
      },
    ],
  },
];
