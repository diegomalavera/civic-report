import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  router: Router = inject(Router);
  domSanitizer: DomSanitizer = inject(DomSanitizer);
  show: WritableSignal<boolean> = signal(false);
  title: string = '';
  message: string = '';

  showConfirm(title: string, message: string) {
    this.title = title;
    this.message = message;
    this.show.set(true);
  }
}
