import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReplydto {
  @IsNotEmpty()
  @IsString()
  readonly writerId: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
