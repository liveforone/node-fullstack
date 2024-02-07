import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePwDto {
  @IsNotEmpty()
  @IsString()
  readonly originalPw: string;

  @IsNotEmpty()
  @IsString()
  readonly newPw: string;
}
