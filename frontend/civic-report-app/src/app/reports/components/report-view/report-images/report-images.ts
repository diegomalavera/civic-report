import { Component, inject, OnInit, signal } from '@angular/core';
import { ReportTabs } from '../report-tabs/report-tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../../core/services/page.service';
import { ReportsService } from '../../../services/reports.service';
import { ReportDto } from '../../../dtos/report.dto';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-report-images',
  imports: [ReportTabs, MatIcon],
  templateUrl: './report-images.html',
  styleUrl: './report-images.scss',
})
export class ReportImages implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  pageService: PageService = inject(PageService);
  reportService: ReportsService = inject(ReportsService);
  id: string = '';
  report: ReportDto = {} as ReportDto;
  images: { name: string; url: string }[] = [];
  current = signal(0);
  fullscreenImage = signal<string | null>(null);
  isFullscreen = signal(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.pageService.setTitle('Reporte - Fotos');
    this.pageService.setPrevious('/app/reports');
    this.loadReport();
  }

  loadReport() {
    this.reportService.findById(this.id).subscribe({
      next: async (report: ReportDto) => {
        this.report = report;
        this.images = report.images;
      },
      error: (error: Error) => {
        this.router.navigate(['/app/reports/list']);
      },
    });
  }

  toggleFullscreen(url?: string) {
    if (this.isFullscreen()) {
      this.fullscreenImage.set(null);
      this.isFullscreen.set(false);
    } else if (url) {
      this.fullscreenImage.set(url);
      this.isFullscreen.set(true);
    }
  }

  next() {
    this.current.set((this.current() + 1) % this.images.length);
  }

  prev() {
    this.current.set((this.current() - 1 + this.images.length) % this.images.length);
  }
}
