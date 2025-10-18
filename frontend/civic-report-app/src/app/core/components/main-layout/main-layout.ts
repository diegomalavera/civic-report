import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Menu } from '../menu/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Menu, MatSidenavModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements AfterViewInit {
  private pageService: PageService = inject(PageService);
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  opened: boolean = false;

  ngAfterViewInit() {
    this.pageService.setSidenav(this.sidenav);
  }
}
