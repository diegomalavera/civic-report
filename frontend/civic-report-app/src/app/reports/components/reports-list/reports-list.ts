import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../../core/services/message.service';
import { PageService } from '../../../core/services/page.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ReportsService } from '../../services/reports.service';
import { ReportDto } from '../../dtos/report.dto';
import { JwtService } from '../../../auth/services/jwt.service';

@Component({
  selector: 'app-reports-list',
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatIcon],
  templateUrl: './reports-list.html',
  styleUrl: './reports-list.scss',
})
export class ReportsList implements OnInit {
  router: Router = inject(Router);
  pageService: PageService = inject(PageService);
  messageService: MessageService = inject(MessageService);
  reportsService: ReportsService = inject(ReportsService);
  jwtService: JwtService = inject(JwtService);
  reports: ReportDto[] = [];
  reportsFiltered: ReportDto[] = [];
  searchValue: string = '';
  canAddReport: boolean = false;

  async ngOnInit() {
    this.pageService.setTitle('Reportes');
    this.pageService.setPrevious('/app/home');
    this.loadReports();
    this.canAddReport = await this.jwtService.userCan('reports_create');
  }

  loadReports() {
    this.reportsService.findAll().subscribe({
      next: async (reports: ReportDto[]) => {
        this.reports = reports;
        this.reportsFiltered = reports;
      },
      error: (error: Error) => {
        this.messageService.showMessage(error.message);
      },
    });
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.reportsFiltered = this.reports.filter((report) =>
      report.name.toLowerCase().includes(value)
    );
  }

  clearSearch() {
    this.searchValue = '';
    this.reportsFiltered = this.reports;
  }

  view(id: string) {
    this.router.navigate(['/app/reports/detail', id]);
  }

  create() {
    this.router.navigate(['/app/reports/create']);
  }
}
