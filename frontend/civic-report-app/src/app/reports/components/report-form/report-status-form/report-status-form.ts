import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ReportsService } from '../../../services/reports.service';
import { ReportDto } from '../../../dtos/report.dto';
import { MessageService } from '../../../../core/services/message.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-report-status-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule,
  ],
  templateUrl: './report-status-form.html',
  styleUrl: './report-status-form.scss',
})
export class ReportStatusForm {
  router: Router = inject(Router);
  reportsService: ReportsService = inject(ReportsService);
  messageService: MessageService = inject(MessageService);
  dialogRef = inject(MatDialogRef<ReportStatusForm>);
  data = inject<{ id: string }>(MAT_DIALOG_DATA);

  form = new FormGroup({
    status: new FormControl('', [Validators.required]),
  });

  formSubmit() {
    if (this.form.valid) {
      const status = this.form.controls['status'].value || '';
      this.reportsService.updateStatus(this.data.id, status).subscribe({
        next: async (report: ReportDto) => {
          this.messageService.showMessage('Estado actualizado correctamente.').then(() => {
            this.dialogRef.close();
          });
        },
        error: (error: Error) => {
          this.messageService.showMessage(error.message);
        },
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
