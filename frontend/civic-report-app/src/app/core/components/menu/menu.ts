import { Component, inject } from '@angular/core';
import { MenuItemDto } from '../../dtos/menu-item.dto';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PageService } from '../../services/page.service';
import { UserDto } from '../../../users/dtos/user.dto';

@Component({
  selector: 'app-menu',
  imports: [MatButton, MatIcon],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  router: Router = inject(Router);
  pageService: PageService = inject(PageService);
  options: MenuItemDto[] = [];

  async ngOnInit() {
    this.options = await this.pageService.getAvailableOptions(false);
  }

  isActive(route: string) {
    return this.router.url === route;
  }

  navigate(option: MenuItemDto) {
    if (option.action) {
      option.action();
    } else {
      this.pageService.toggleSidenav();
      this.router.navigate([option.route]);
    }
  }
}
