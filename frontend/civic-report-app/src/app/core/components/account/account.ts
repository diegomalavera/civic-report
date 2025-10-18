import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from '../../services/page.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { JwtService } from '../../../auth/services/jwt.service';
import { OtpService } from '../../../auth/services/otp.service';
import { ValidateEmailResponseDto } from '../../../auth/dtos/validate-email-response.dto';
import { MessageService } from '../../services/message.service';
import { UsersService } from '../../../users/services/users.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserDto } from '../../../users/dtos/user.dto';
import { PayloadDto } from '../../dtos/payload.dto';
import { passwordsMatchValidator } from '../../validators/passwords-match.validator';
import { strongPasswordValidator } from '../../validators/strong-password.validator';
import { ValidateOtp } from '../../../auth/components/validate-otp/validate-otp';
import { UpdateUserDto } from '../../../users/dtos/update-user.dto';

@Component({
  selector: 'app-account',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ValidateOtp,
  ],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account implements OnInit {
  @ViewChild(ValidateOtp)
  childValidateOtp!: ValidateOtp;
  router: Router = inject(Router);
  pageService: PageService = inject(PageService);
  jwtService: JwtService = inject(JwtService);
  otpService: OtpService = inject(OtpService);
  authService: AuthService = inject(AuthService);
  usersService: UsersService = inject(UsersService);
  messageService: MessageService = inject(MessageService);
  form = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [strongPasswordValidator()]),
      confirmPassword: new FormControl(''),
    },
    {
      validators: passwordsMatchValidator,
    }
  );
  user!: UserDto;
  accessToken: PayloadDto | null = {} as PayloadDto;

  async ngOnInit() {
    this.pageService.setTitle('Tu cuenta');
    this.pageService.setPrevious('/app/home');
    this.pageService.displayBackButton.set(false);
    this.user = await this.jwtService.getUser();
    this.accessToken = await this.jwtService.getAccessToken();
    this.loadForm();
  }

  loadForm() {
    this.form.controls['name'].setValue(this.user.name);
    this.form.controls['lastName'].setValue(this.user.lastName);
    this.form.controls['email'].setValue(this.user.email);
  }

  formSubmit() {
    if (this.form.valid) {
      const email: string = this.form.controls['email'].value || '';
      if (email !== this.user.email) {
        this.validateEmail();
      } else {
        this.update();
      }
    }
  }

  validateEmail() {
    this.otpService.type = 'account-update';
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
          this.messageService
            .showMessage(
              'Se ha enviado un código de verificación a su dirección de correo electrónico.'
            )
            .then(() => {
              this.childValidateOtp.initModal();
            });
        },
        error: (error: Error) => {
          this.messageService.showMessage(error.message);
        },
      });
  }

  emailValidated(validated: boolean) {
    if (validated) {
      this.update();
    }
  }

  update() {
    const updateUserDto: UpdateUserDto = {
      email: this.form.controls['email'].value || '',
      name: this.form.controls['name'].value || '',
      lastName: this.form.controls['lastName'].value || '',
    };

    const password: string = this.form.controls['password'].value || '';
    if (password != null && password !== '') {
      updateUserDto.password = password;
    }

    if (this.accessToken) {
      this.usersService.update(this.accessToken.sub, updateUserDto).subscribe({
        next: async (userDto: UserDto) => {
          this.form.controls['password'].setValue('');
          this.form.controls['confirmPassword'].setValue('');
          this.jwtService.saveUser({
            id: userDto.id,
            email: userDto.email,
            name: userDto.name,
            lastName: userDto.lastName,
            fullName: `${userDto.name} ${userDto.lastName}`,
          });
          this.pageService.user.set(userDto);
          this.messageService.showMessage('Datos actualizados correctamente.');
        },
        error: (error: Error) => {
          this.messageService.showMessage(error.message);
        },
      });
    }
  }
}
