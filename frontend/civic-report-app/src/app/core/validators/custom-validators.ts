import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static strongPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    if (!value) return null;
    const strongPassword =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(value);
    return strongPassword ? null : { passwordWeak: true };
  };

  static passwordsMatchValidator: ValidatorFn = (
    form: AbstractControl
  ): ValidationErrors | null => {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    const passwordValue = (password.value ?? '').toString();
    const confirmPasswordValue = (confirmPassword.value ?? '').toString();
    if (passwordValue !== confirmPasswordValue) {
      confirmPassword.setErrors({ passwordsDontMatch: true });
      return { passwordsDontMatch: true };
    }
    if (confirmPassword.hasError('passwordsDontMatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  };
}
