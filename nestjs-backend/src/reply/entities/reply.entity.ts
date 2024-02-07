export class ReplyEntity {
  writer_id: string;
  post_id: bigint;
  content: string;

  static create(writer_id: string, post_id: bigint, content: string) {
    const reply = new ReplyEntity();
    reply.writer_id = writer_id;
    reply.post_id = post_id;
    reply.content = content;
    return reply;
  }
}
