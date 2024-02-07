import { IsNotEmpty, IsString } from 'class-validator';

export class RemovePostDto {
  @IsNotEmpty()
  @IsString()
  readonly writerId: string;
}
