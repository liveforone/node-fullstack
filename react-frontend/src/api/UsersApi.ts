export const UsersApi = {
  BASE_URL: 'http://localhost:3000/users',
  SIGNUP: 'http://localhost:8080/users/signup',
  LOGIN: 'http://localhost:8080/auth/login',
  LOGOUT: 'http://localhost:8080/auth/logout',
  REISSUE: 'http://localhost:8080/auth/reissue',
  UPDATE_PASSWORD: 'http://localhost:8080/users/update/password',
  WITHDRAW: 'http://localhost:8080/users/withdraw',
  PROFILE: 'http://localhost:8080/users/profile',
  RETURN_ID: 'http://localhost:8080/users/return-id',
} as const;
