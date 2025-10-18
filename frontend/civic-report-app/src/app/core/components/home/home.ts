import { Component, inject, OnInit } from '@angular/core';
import { MenuItemDto } from '../../dtos/menu-item.dto';
import { Router } from '@angular/router';
import { PageService } from '../../services/page.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [MatIcon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly pageService: PageService = inject(PageService);
  options: MenuItemDto[] = [];

  async ngOnInit() {
    this.pageService.setTitle('Inicio');
    this.pageService.setPrevious(undefined);
    this.options = await this.pageService.getAvailableOptions(true);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
