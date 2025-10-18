import { Routes } from '@angular/router';
import { permissionGuard } from '../auth/guards/permissions.guard';

export const rolesRoutes: Routes = [
  {
    path: 'roles',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadComponent: () => import('./components/roles-list/roles-list').then((c) => c.RolesList),
        canActivate: [permissionGuard(['roles_read'])],
      },
      {
        path: 'create',
        loadComponent: () => import('./components/role-form/role-form').then((c) => c.RoleForm),
        canActivate: [permissionGuard(['roles_create'])],
      },
      {
        path: 'update/:id',
        loadComponent: () => import('./components/role-form/role-form').then((c) => c.RoleForm),
        canActivate: [permissionGuard(['roles_update'])],
      },
    ],
  },
];
