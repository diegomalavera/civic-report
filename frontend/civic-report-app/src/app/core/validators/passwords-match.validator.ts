import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (
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
