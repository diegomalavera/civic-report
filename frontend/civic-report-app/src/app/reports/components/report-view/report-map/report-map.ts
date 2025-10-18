import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ReportTabs } from '../report-tabs/report-tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../../core/services/page.service';
import { ReportsService } from '../../../services/reports.service';
import { ReportDto } from '../../../dtos/report.dto';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-map',
  imports: [CommonModule, GoogleMap, MapAdvancedMarker, ReportTabs],
  templateUrl: './report-map.html',
  styleUrl: './report-map.scss',
})
export class ReportMap implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  pageService: PageService = inject(PageService);
  reportService: ReportsService = inject(ReportsService);
  id: string = '';
  report: ReportDto = {} as ReportDto;
  center: google.maps.LatLngLiteral = { lat: 4.711, lng: -74.072 };
  zoom = 18;
  mapId = '9b08a75eed2d2c9de1da4f1a';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.pageService.setTitle('Reporte - Mapa');
    this.pageService.setPrevious('/app/reports');
    this.loadReport();
  }

  loadReport() {
    this.reportService.findById(this.id).subscribe({
      next: async (report: ReportDto) => {
        this.report = report;
        this.center = { lat: report.latitude, lng: report.longitude };
      },
      error: (error: Error) => {
        this.router.navigate(['/app/reports/list']);
      },
    });
  }
}
