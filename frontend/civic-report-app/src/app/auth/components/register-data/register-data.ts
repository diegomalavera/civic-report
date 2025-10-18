import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';
import { AuthService } from '../../services/auth.service';
import { BackButton } from '../../../core/components/back-button/back-button';
import { LoginResponseDto } from '../../dtos/login-response.dto';
import { PayloadDto } from '../../../core/dtos/payload.dto';
import { JwtService } from '../../services/jwt.service';
import { OtpService } from '../../services/otp.service';

@Component({
  selector: 'app-register-data',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, BackButton],
  templateUrl: './register-data.html',
  styleUrl: './register-data.scss',
})
export class RegisterData implements OnInit {
  router: Router = inject(Router);
  jwtService: JwtService = inject(JwtService);
  authService: AuthService = inject(AuthService);
  otpService: OtpService = inject(OtpService);
  messageService: MessageService = inject(MessageService);
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

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

  formSubmit() {
    if (this.form.valid) {
      this.otpService.name = this.form.controls['name'].value || '';
      this.otpService.lastName = this.form.controls['lastName'].value || '';
      this.authService
        .register({
          email: this.otpService.email,
          password: this.otpService.password,
          confirmPassword: this.otpService.confirmPassword,
          name: this.otpService.name,
          lastName: this.otpService.lastName,
          date: new Date(),
        })
        .subscribe({
          next: async (response: LoginResponseDto) => {
            const payload: PayloadDto | null = await this.jwtService.getAccessToken();
            if (payload) {
              const message: string = `<b>Bievenido</b><Br /> ${payload.name} ${payload.lastName}`;
              this.messageService.showMessage(message).then(() => {
                this.router.navigate(['/app/home']);
              });
            }
          },
          error: (error: Error) => {
            this.messageService.showMessage(error.message);
          },
        });
    }
  }
}
