import { ReplyPage } from './ReplyPage';

export interface ReplyPageDto {
  replyPages: ReplyPage[];
  metadata: {
    lastId: bigint;
  };
}
