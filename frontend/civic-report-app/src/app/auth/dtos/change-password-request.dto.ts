export class ChangePasswordRequestDto {
  readonly email!: string;
  readonly password!: string;
  readonly confirmPassword!: string;
  readonly date!: Date;
}
