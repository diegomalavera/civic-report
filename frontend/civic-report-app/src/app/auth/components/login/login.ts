import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoginResponseDto } from '../../dtos/login-response.dto';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from '../../../core/services/message.service';
import { JwtService } from '../../services/jwt.service';
import { PayloadDto } from '../../../core/dtos/payload.dto';
import { OtpService } from '../../services/otp.service';
import { PageService } from '../../../core/services/page.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router: Router = inject(Router);
  messageService: MessageService = inject(MessageService);
  pageService: PageService = inject(PageService);
  jwtService: JwtService = inject(JwtService);
  authService: AuthService = inject(AuthService);
  otpService: OtpService = inject(OtpService);
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  showPassword = signal(true);

  formSubmit() {
    if (this.form.valid) {
      this.authService
        .login({
          email: this.form.controls['email'].value || '',
          password: this.form.controls['password'].value || '',
        })
        .subscribe({
          next: async (response: LoginResponseDto) => {
            const payload: PayloadDto | null = await this.jwtService.getAccessToken();
            if (payload) {
              this.pageService.user.set(await this.jwtService.getUser());
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

  forgotPassword() {
    this.otpService.type = 'forgot-password';
    this.router.navigate(['/auth/validate-email']);
  }

  register() {
    this.otpService.type = 'register';
    this.router.navigate(['/auth/validate-email']);
  }

  togglePassword(event: MouseEvent) {
    this.showPassword.set(!this.showPassword());
    event.stopPropagation();
  }
}
