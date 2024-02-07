//페이징용 dto
export interface PostPage {
  readonly id: bigint;
  readonly title: string;
  readonly writer_id: string;
  readonly created_date: Date;
}
