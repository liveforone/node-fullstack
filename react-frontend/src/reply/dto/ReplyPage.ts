export interface ReplyPage {
  id: bigint;
  writer_id: string;
  post_id: bigint;
  content: string;
  reply_state: string;
  created_date: Date;
}
