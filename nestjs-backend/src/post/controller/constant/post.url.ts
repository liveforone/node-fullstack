export const PostUrl = {
  ROOT: 'posts',
  BELONG_WRITER: 'belong-writer/:writerId',
  SEARCH_POSTS: 'search',
  ALL_OFFSET: 'offset',
  BELONG_WRITER_OFFSET: 'belong-writer/offset/:writerId',
  SEARCH_POSTS_OFFSET: 'search/offset',
  DETAIL: ':id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;
