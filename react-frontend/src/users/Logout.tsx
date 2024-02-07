import { FormEvent } from 'react';
import { isTokenExistInLocalstorage } from '../auth/CheckTokenExist';
import axios from 'axios';
import { getAccessToken } from '../auth/GetAuth';
import { useNavigate } from 'react-router-dom';
import { removeToken, removeUserId } from '../auth/RemoveAuth';
import { AuthConstant } from '../auth/constant/auth.constant';
import { UsersApi } from '../api/UsersApi';

const Logout = () => {
  const navigate = useNavigate();
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isTokenExistInLocalstorage()) {
      try {
        const response = await axios.post(
          UsersApi.LOGOUT,
          {},
          {
            headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
          },
        );
        alert(response.data);
      } catch {
        alert('토큰이 유효하지 않습니다. 재로그인 후 시도해주세요');
      }
      removeToken();
      removeUserId();
    } else {
      alert('이미 로그아웃 되어있습니다.');
    }
    navigate('/', { replace: true });
  };
  return (
    <div className="container">
      <h2>안녕히가세요</h2>
      <form onSubmit={submitHandler}>
        <button type="submit" className="btn btn-primary">
          로그아웃
        </button>
      </form>
    </div>
  );
};

export default Logout;
