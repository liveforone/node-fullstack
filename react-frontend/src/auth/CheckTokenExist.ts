import { AuthConstant } from './constant/auth.constant';

export function isTokenExistInLocalstorage() {
  const accessToken = localStorage.getItem(AuthConstant.ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(AuthConstant.REFRESH_TOKEN);

  if (accessToken && refreshToken) {
    return true;
  } else {
    return false;
  }
}
