import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatButton, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  pageService: PageService = inject(PageService);
}
