import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Loading } from './core/components/loading/loading';
import { Message } from './core/components/message/message';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Loading, Message],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('civic-report-app');
}
