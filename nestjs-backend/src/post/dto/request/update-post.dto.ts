import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  readonly writerId: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
