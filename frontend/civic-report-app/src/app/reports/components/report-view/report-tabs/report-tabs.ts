import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-report-tabs',
  imports: [RouterModule, MatIcon],
  templateUrl: './report-tabs.html',
  styleUrl: './report-tabs.scss',
})
export class ReportTabs implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  id: string = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }

  navigate(action: string) {
    this.router.navigate([`/app/reports/${action}/${this.id}`]);
  }

  isActive(action: string) {
    return this.router.url === `/app/reports/${action}/${this.id}`;
  }
}
