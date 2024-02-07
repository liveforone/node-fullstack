import axios from 'axios';
import { AuthConstant } from './constant/auth.constant';
import { UsersApi } from '../api/UsersApi';
import { isTokenExistInLocalstorage } from './CheckTokenExist';
import { getAccessToken } from './GetAuth';
import { axiosErrorHandle } from '../error/axiosErrorHandle';

export async function setUserAuth() {
  if (isTokenExistInLocalstorage()) {
    try {
      const response = await axios.get(UsersApi.RETURN_ID, {
        headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
      });
      localStorage.setItem(AuthConstant.USER_ID, response.data.id);
      return true;
    } catch (error) {
      axiosErrorHandle(error);
    }
    return true;
  }
  return false;
}
