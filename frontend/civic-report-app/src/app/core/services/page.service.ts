import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MenuItemDto } from '../dtos/menu-item.dto';
import { JwtService } from '../../auth/services/jwt.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { UserDto } from '../../users/dtos/user.dto';

@Injectable({ providedIn: 'root' })
export class PageService {
  router: Router = inject(Router);
  jwtService: JwtService = inject(JwtService);
  authService: AuthService = inject(AuthService);
  title: WritableSignal<string> = signal('Inicio');
  user: WritableSignal<UserDto> = signal({} as UserDto);
  options: MenuItemDto[] = [
    {
      title: 'Inicio',
      description: 'Opciones principales',
      icon: 'home',
      route: '/app/home',
      permission: 'all',
      visible: false,
    },
    {
      title: 'Administrar roles',
      description: 'Administrar roles de la aplicación.',
      icon: 'assignment_ind',
      route: '/app/roles/list',
      permission: 'roles_read',
      visible: true,
    },
    {
      title: 'Administrar usuarios',
      description: 'Administrar usuarios de la aplicación.',
      icon: 'groups',
      route: '/app/users/list',
      permission: 'users_read',
      visible: true,
    },
    {
      title: 'Reportes',
      description: 'Ver reportes comunitarios.',
      icon: 'assignment_late',
      route: '/app/reports/list',
      permission: 'reports_read',
      visible: true,
    },
    {
      title: 'Cuenta',
      description: 'Ver tu cuenta de usuario.',
      icon: 'account_circle',
      route: '/app/account',
      permission: 'all',
      visible: false,
    },
    {
      title: 'Cerrar sesión',
      description: 'Salir de la cuenta de reportes comunitarios.',
      icon: 'logout',
      route: '/auth/logout',
      permission: 'all',
      visible: false,
      action: () => {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      },
    },
  ];
  previous?: string;
  sidenav?: any;
  displayBackButton: WritableSignal<boolean> = signal(true);

  constructor() {
    this.loadUser();
  }

  async loadUser() {
    this.user.set(await this.jwtService.getUser());
  }

  setTitle(title: string) {
    this.title.set(title);
  }

  setPrevious(previous: string | undefined) {
    this.previous = previous;
  }

  setSidenav(sidenav: any) {
    this.sidenav = sidenav;
  }

  toggleSidenav() {
    this.sidenav?.toggle();
  }

  async getAvailableOptions(skip: boolean) {
    const permissions = await this.jwtService.getPermissions();
    return this.options.filter(
      (option) =>
        (!skip || option.visible) &&
        (option.permission === 'all' || permissions.includes(option.permission))
    );
  }

  goToPrevius() {
    this.router.navigate([this.previous]);
    this.previous = undefined;
  }
}
