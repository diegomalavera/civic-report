import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../../../core/services/message.service';
import { Router } from '@angular/router';
import { ValidateEmailResponseDto } from '../../dtos/validate-email-response.dto';
import { BackButton } from '../../../core/components/back-button/back-button';
import { OtpService } from '../../services/otp.service';
import { PageService } from '../../../core/services/page.service';

@Component({
  selector: 'app-validate-email',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, BackButton],
  templateUrl: './validate-email.html',
  styleUrl: './validate-email.scss',
})
export class ValidateEmail implements OnInit {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  otpService: OtpService = inject(OtpService);
  messageService: MessageService = inject(MessageService);
  pageService: PageService = inject(PageService);
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit() {
    this.pageService.displayBackButton.set(true);
    this.validateProcess();
  }

  validateProcess() {
    const { type } = this.otpService;

    if (!type) {
      this.router.navigate(['/auth/login']);
    }
  }

  formSubmit() {
    if (this.form.valid) {
      this.otpService.email = this.form.controls['email'].value || '';
      this.authService
        .validateEmail({
          type: this.otpService.type,
          email: this.otpService.email,
          date: new Date(),
        })
        .subscribe({
          next: async (response: ValidateEmailResponseDto) => {
            this.otpService.expiration = response.expiration;
            this.messageService.showMessage(response.message).then(() => {
              this.router.navigate(['/auth/validate-otp']);
            });
          },
          error: (error: Error) => {
            this.messageService.showMessage(error.message);
          },
        });
    }
  }
}
