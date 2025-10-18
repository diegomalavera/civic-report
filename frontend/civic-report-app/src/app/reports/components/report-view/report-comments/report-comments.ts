import { Component, inject, OnInit } from '@angular/core';
import { ReportDto } from '../../../dtos/report.dto';
import { PageService } from '../../../../core/services/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';
import { DatePipe } from '@angular/common';
import { ReportTabs } from '../report-tabs/report-tabs';
import { MatDialog } from '@angular/material/dialog';
import { ReportCommentForm } from '../../report-form/report-comment-form/report-comment-form';
import { MatButtonModule } from '@angular/material/button';
import { JwtService } from '../../../../auth/services/jwt.service';

@Component({
  selector: 'app-report-comments',
  imports: [DatePipe, ReportTabs, MatButtonModule],
  templateUrl: './report-comments.html',
  styleUrl: './report-comments.scss',
})
export class ReportComments implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  pageService: PageService = inject(PageService);
  reportService: ReportsService = inject(ReportsService);
  jwtService: JwtService = inject(JwtService);
  dialog = inject(MatDialog);
  id: string = '';
  report: ReportDto = {} as ReportDto;
  comments: { author: string; message: string; createdAt: Date }[] = [];
  canAddComment: boolean = false;

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.pageService.setTitle('Reporte - Comentarios');
    this.pageService.setPrevious('/app/reports');
    this.loadReport();
    this.canAddComment = await this.jwtService.userCan('reports_update');
  }

  loadReport() {
    this.reportService.findById(this.id).subscribe({
      next: async (report: ReportDto) => {
        this.report = report;
        this.comments = report.comments;
      },
      error: (error: Error) => {
        this.router.navigate(['/app/reports/list']);
      },
    });
  }

  addComment() {
    const dialogRef = this.dialog.open(ReportCommentForm, {
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
