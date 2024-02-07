import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveReplyDto {
  @IsNotEmpty()
  @IsString()
  readonly writerId: string;
}
