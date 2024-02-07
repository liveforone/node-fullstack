import { $Enums } from '@prisma/client';

export interface ReplyPage {
  readonly id: bigint;
  readonly content: string;
  readonly writer_id: string;
  readonly post_id: bigint;
  readonly reply_state: $Enums.ReplyState;
  readonly created_date: Date;
}
