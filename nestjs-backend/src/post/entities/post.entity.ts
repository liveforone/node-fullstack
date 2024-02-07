export class PostEntity {
  title: string;
  content: string;
  writer_id: string;

  static create(title: string, content: string, writer_id: string) {
    const post = new PostEntity();
    post.title = title;
    post.content = content;
    post.writer_id = writer_id;
    return post;
  }
}
