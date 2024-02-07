import { AuthConstant } from './constant/auth.constant';

export function getAccessToken() {
  return localStorage.getItem(AuthConstant.ACCESS_TOKEN);
}

export function getRefreshToken() {
  return localStorage.getItem(AuthConstant.REFRESH_TOKEN);
}

export function getUserId() {
  return localStorage.getItem(AuthConstant.USER_ID);
}
