import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
