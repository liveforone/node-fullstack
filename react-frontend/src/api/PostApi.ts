export const PostApi = {
  BASE_URL: 'http://localhost:3000/posts',
  ALL: 'http://localhost:8080/posts',
  /**
   * 뒤에 writerId(string) param 추가
   */
  BELONG_WRITER: 'http://localhost:8080/posts/belong-writer/',
  SEARCH: 'http://localhost:8080/posts/search',
  /**
   * 뒤에 id(bigint) param 추가
   */
  DETAIL: 'http://localhost:8080/posts/',
  CREATE: 'http://localhost:8080/posts',
  /**
   * 뒤에 id(bigint) param 추가
   */
  UPDATE: 'http://localhost:8080/posts/',
  /**
   * 뒤에 id(bigint) param 추가
   */
  REMOVE: 'http://localhost:8080/posts/',
} as const;
