import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  readonly writerId: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
