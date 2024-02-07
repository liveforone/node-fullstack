import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  @IsString()
  readonly writerId: string;

  @IsNotEmpty()
  readonly postId: bigint;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
