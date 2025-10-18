import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-empty-layout',
  imports: [RouterOutlet],
  templateUrl: './empty-layout.html',
  styleUrl: './empty-layout.scss',
})
export class EmptyLayout implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(document.body, 'empty-layout-active');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'empty-layout-active');
  }
}
