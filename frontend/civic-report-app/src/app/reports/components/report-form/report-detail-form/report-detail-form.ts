import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../../core/services/page.service';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-report-detail-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './report-detail-form.html',
  styleUrl: './report-detail-form.scss',
})
export class ReportDetailForm implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  pageService: PageService = inject(PageService);
  reportsService: ReportsService = inject(ReportsService);
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.pageService.setPrevious('/app/reports/list');
    this.pageService.setTitle('Crear reporte');
  }

  formSubmit(): void {
    if (this.form.valid) {
      this.reportsService.report.name = this.form.controls['name'].value || '';
      this.reportsService.report.description = this.form.controls['description'].value || '';
      this.router.navigate(['/app/reports/create/images']);
    }
  }
}
