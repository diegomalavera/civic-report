import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class MessageService {
  router: Router = inject(Router);
  domSanitizer: DomSanitizer = inject(DomSanitizer);
  show: WritableSignal<boolean> = signal(false);
  message: SafeHtml = '';

  showMessage(message: string): Promise<void> {
    this.message = this.domSanitizer.bypassSecurityTrustHtml(message);
    this.show.set(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.show.set(false);
        resolve();
      }, 2000);
    });
  }
}
