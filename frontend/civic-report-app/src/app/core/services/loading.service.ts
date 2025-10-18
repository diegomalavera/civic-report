import { effect, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  show: WritableSignal<boolean> = signal(false);

  showLoading() {
    this.show.set(true);
  }

  hideLoading() {
    this.show.set(false);
  }
}
