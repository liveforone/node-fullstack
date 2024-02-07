import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
