export class PayloadDto {
  readonly sub: string = '';
  readonly email: string = '';
  readonly name: string = '';
  readonly lastName: string = '';
  readonly permissions: string[] = [];
  readonly iat: number = 0;
  readonly exp: number = 0;
  readonly aud: string[] = [];
  readonly iss: string = '';
  token: string = '';
  refreshToken: string = '';
}