import { Component, inject, OnInit } from '@angular/core';
import { ReportDto } from '../../../dtos/report.dto';
import { PageService } from '../../../../core/services/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';
import { DatePipe } from '@angular/common';
import { ReportTabs } from '../report-tabs/report-tabs';
import { JwtService } from '../../../../auth/services/jwt.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ReportStatusForm } from '../../report-form/report-status-form/report-status-form';

@Component({
  selector: 'app-report-detail',
  imports: [DatePipe, ReportTabs, MatButtonModule],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.scss',
})
export class ReportDetail implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  pageService: PageService = inject(PageService);
  reportService: ReportsService = inject(ReportsService);
  jwtService: JwtService = inject(JwtService);
  dialog = inject(MatDialog);
  id: string = '';
  report: ReportDto = {} as ReportDto;
  canChangeStatus: boolean = false;

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.pageService.setTitle('Reporte');
    this.pageService.setPrevious('/app/reports');
    this.loadReport();
    this.canChangeStatus = await this.jwtService.userCan('reports_update');
  }

  loadReport() {
    this.reportService.findById(this.id).subscribe({
      next: async (report: ReportDto) => {
        this.report = report;
      },
      error: (error: Error) => {
        this.router.navigate(['/app/reports/list']);
      },
    });
  }

  changeStatus() {
    const dialogRef = this.dialog.open(ReportStatusForm, {
      autoFocus: false,
      data: {
        id: this.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadReport();
    });
  }
}
