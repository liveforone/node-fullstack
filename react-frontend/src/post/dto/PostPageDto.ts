import { PostPage } from './PostPage';

export interface PostPageDto {
  postPages: PostPage[];
  metadata: {
    lastId: bigint;
  };
}
