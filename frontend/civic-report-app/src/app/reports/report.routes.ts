import { Routes } from '@angular/router';
import { permissionGuard } from '../auth/guards/permissions.guard';

export const reportRoutes: Routes = [
  {
    path: 'reports',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadComponent: () =>
          import('./components/reports-list/reports-list').then((c) => c.ReportsList),
        canActivate: [permissionGuard(['reports_read'])],
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./components/report-view/report-detail/report-detail').then(
            (c) => c.ReportDetail
          ),
        canActivate: [permissionGuard(['reports_read'])],
      },
      {
        path: 'images/:id',
        loadComponent: () =>
          import('./components/report-view/report-images/report-images').then(
            (c) => c.ReportImages
          ),
        canActivate: [permissionGuard(['reports_read'])],
      },
      {
        path: 'map/:id',
        loadComponent: () =>
          import('./components/report-view/report-map/report-map').then((c) => c.ReportMap),
        canActivate: [permissionGuard(['reports_read'])],
      },
      {
        path: 'comments/:id',
        loadComponent: () =>
          import('./components/report-view/report-comments/report-comments').then(
            (c) => c.ReportComments
          ),
        canActivate: [permissionGuard(['reports_read'])],
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./components/report-form/report-detail-form/report-detail-form').then(
            (c) => c.ReportDetailForm
          ),
        canActivate: [permissionGuard(['reports_create'])],
      },
      {
        path: 'create/images',
        loadComponent: () =>
          import('./components/report-form/report-images-form/report-images-form').then(
            (c) => c.ReportImagesForm
          ),
        canActivate: [permissionGuard(['reports_create'])],
      },
      {
        path: 'create/map',
        loadComponent: () =>
          import('./components/report-form/report-map-form/report-map-form').then(
            (c) => c.ReportMapForm
          ),
        canActivate: [permissionGuard(['reports_create'])],
      },
    ],
  },
];
