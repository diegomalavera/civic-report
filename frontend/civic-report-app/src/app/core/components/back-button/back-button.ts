import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-back-button',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
})
export class BackButton {
  @Input() route: string = '/';
  router: Router = inject(Router);
  pageService: PageService = inject(PageService);

  navigate() {
    this.router.navigate([this.route]);
  }
}
