import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';
import { AuthService } from '../../services/auth.service';
import { BackButton } from '../../../core/components/back-button/back-button';
import { strongPasswordValidator } from '../../../core/validators/strong-password.validator';
import { passwordsMatchValidator } from '../../../core/validators/passwords-match.validator';
import { MatIcon } from '@angular/material/icon';
import { OtpService } from '../../services/otp.service';

@Component({
  selector: 'app-register-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BackButton,
    MatIcon,
  ],
  templateUrl: './register-password.html',
  styleUrl: './register-password.scss',
})
export class RegisterPassword implements OnInit {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  otpService: OtpService = inject(OtpService);
  messageService: MessageService = inject(MessageService);
  form = new FormGroup({
    password: new FormControl('', [Validators.required, strongPasswordValidator()]),
    confirmPassword: new FormControl('', [
      Validators.required,
      //passwordsMatchValidator('password'),
    ]),
  });
  showPassword = signal(true);
  showConfirmPassword = signal(true);

  ngOnInit() {
    this.validateProcess();
  }

  validateProcess() {
    const { type, email, expiration } = this.otpService;

    if (!type || !email || !expiration) {
      this.router.navigate(['/auth/login']);
    }

    this.validateOtpExpiration();
  }

  validateOtpExpiration() {
    const otpExpiration = new Date(this.otpService.expiration);
    const now = new Date();
    let diff = Math.floor((otpExpiration.getTime() - now.getTime()) / 1000);
    if (diff <= 0) {
      this.router.navigate(['/auth/login']);
    }
  }

  togglePassword(event: MouseEvent) {
    this.showPassword.set(!this.showPassword());
    event.stopPropagation();
  }

  toggleConfirmPassword(event: MouseEvent) {
    this.showConfirmPassword.set(!this.showConfirmPassword());
    event.stopPropagation();
  }

  formSubmit() {
    if (this.form.valid) {
      this.otpService.password = this.form.controls['password'].value || '';
      this.otpService.confirmPassword = this.form.controls['confirmPassword'].value || '';
      this.router.navigate(['/auth/register-data']);
    }
  }
}
