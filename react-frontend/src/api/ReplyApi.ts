export const ReplyApi = {
  BASE_URL: 'http://localhost:3000/reply',
  BELONG_POST: 'http://localhost:8080/reply/belong-post/',
  CREATE: 'http://localhost:8080/reply',
  /**
   * 뒤에 id 붙이기
   */
  UPDATE: 'http://localhost:8080/reply/',
  /**
   * 뒤에 id 붙이기
   */
  REMOVE: 'http://localhost:8080/reply/',
} as const;
