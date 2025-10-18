import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ResponseDto } from '../../dtos/response.dto';
import { BackButton } from '../../../core/components/back-button/back-button';
import { OtpService } from '../../services/otp.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-validate-otp',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    BackButton,
  ],
  templateUrl: './validate-otp.html',
  styleUrl: './validate-otp.scss',
})
export class ValidateOtp implements OnInit, OnDestroy {
  @Input()
  type: string = 'page';
  @Input()
  displayBackButton: boolean = true;
  @Output()
  validated = new EventEmitter<boolean>();
  display: WritableSignal<boolean> = signal(true);
  router: Router = inject(Router);
  formBuilder: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  otpService: OtpService = inject(OtpService);
  messageService: MessageService = inject(MessageService);
  form = new FormGroup({
    digits: this.formBuilder.array(
      Array(6)
        .fill('')
        .map(() => this.formBuilder.control('', [Validators.required, Validators.pattern(/^\S$/)]))
    ),
  });
  minutes: number = 5;
  seconds: number = 0;
  intervalId: any;
  otpExpiration: Date = new Date();
  otpLength = 6;
  otpDigits: string[] = Array(this.otpLength).fill('');

  ngOnInit() {
    if (this.type == 'page') {
      this.validateProcess();
      this.initTimer();
    } else {
      this.display.set(false);
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  initModal() {
    this.initTimer();
    this.tooggleModal(true);
  }

  tooggleModal(display: boolean) {
    this.display.set(display);
  }

  validateProcess() {
    const { type, email, expiration } = this.otpService;
    if (!type || !email || !expiration) {
      this.router.navigate(['/auth/login']);
    }
  }

  initTimer() {
    this.otpExpiration = new Date(this.otpService.expiration);
    this.updateTimer();
    this.intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    const now = new Date();
    let diff = Math.floor((this.otpExpiration.getTime() - now.getTime()) / 1000);
    if (diff > 0) {
      this.minutes = Math.floor(diff / 60);
      this.seconds = diff % 60;
    } else {
      clearInterval(this.intervalId);
      this.minutes = 0;
      this.seconds = 0;
    }
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  formSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.otpService
        .validateOtp({
          type: this.otpService.type,
          email: this.otpService.email,
          code: this.digits.map((control) => control.value).join(''),
          date: new Date(),
        })
        .subscribe({
          next: async (response: ResponseDto) => {
            this.messageService.showMessage(response.message).then(() => {
              this.processed();
            });
          },
          error: (error: Error) => {
            this.messageService.showMessage(error.message);
          },
        });
    }
  }

  processed() {
    if (this.otpService.type == 'forgot-password') {
      this.router.navigate(['/auth/change-password']);
    }
    if (this.otpService.type == 'register') {
      this.router.navigate(['/auth/register-password']);
    }
    if (this.otpService.type == 'account-update') {
      this.validated.emit(true);
      this.tooggleModal(false);
    }
  }

  onOtpInput(event: any, index: number, inputElement: HTMLInputElement) {
    const value = event.target.value;
    if (value.length > 1) {
      this.digits[index].setValue(value.charAt(0));
      inputElement.value = value.charAt(0);
    }
    if (value && index < this.otpLength - 1) {
      const nextInput = inputElement.nextElementSibling as HTMLInputElement | null;
      nextInput?.focus();
    }
  }

  onOtpKeyDown(event: any, index: number, inputElement: HTMLInputElement) {
    if (event.key === 'Backspace' && !this.digits[index].value && index > 0) {
      const prevInput = inputElement.previousElementSibling as HTMLInputElement | null;
      prevInput?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    if (pasteData.length !== this.otpLength || pasteData.includes(' ')) return;
    for (let i = 0; i < this.otpLength; i++) {
      this.digits[i].setValue(pasteData[i]);
    }
  }

  get digits(): FormControl[] {
    return (this.form.get('digits') as FormArray).controls as FormControl[];
  }

  get formattedTime(): string {
    const m = this.minutes.toString().padStart(2, '0');
    const s = this.seconds.toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}
