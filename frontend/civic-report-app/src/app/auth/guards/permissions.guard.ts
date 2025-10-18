import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { MessageService } from '../../core/services/message.service';

export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const jwtService = inject(JwtService);
    const router = inject(Router);
    const messageService = inject(MessageService);

    const isAuth = await jwtService.isAuthenticated();
    if (!isAuth) {
      await router.navigate(['auth/login']);
      return false;
    }

    const permissions = await jwtService.getPermissions();
    const hasPermission = requiredPermissions.some(p => permissions.includes(p));

    if (!hasPermission) {
      await messageService.showMessage('No cuentas con los permisos necesarios.');
      await router.navigate(['app/home']);
      return false;
    }

    return true;
  };
};
