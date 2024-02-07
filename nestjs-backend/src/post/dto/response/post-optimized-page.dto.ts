import { PostPage } from './post-page.dto';

export interface PostOptimizedPageDto {
  readonly postPages: PostPage[];
  readonly metadata: {
    readonly lastId: bigint;
  };
}
