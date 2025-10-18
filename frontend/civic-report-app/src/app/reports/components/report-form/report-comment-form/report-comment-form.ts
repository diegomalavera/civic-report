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

@Component({
  selector: 'app-report-comment-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './report-comment-form.html',
  styleUrl: './report-comment-form.scss',
})
export class ReportCommentForm {
  router: Router = inject(Router);
  reportsService: ReportsService = inject(ReportsService);
  messageService: MessageService = inject(MessageService);
  dialogRef = inject(MatDialogRef<ReportCommentForm>);
  data = inject<{ id: string }>(MAT_DIALOG_DATA);

  form = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  formSubmit() {
    if (this.form.valid) {
      const message = this.form.controls['message'].value || '';
      this.reportsService.addComment(this.data.id, message).subscribe({
        next: async (report: ReportDto) => {
          this.messageService.showMessage('Comentario agregado correctamente.').then(() => {
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
