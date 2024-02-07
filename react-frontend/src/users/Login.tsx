import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { AuthConstant } from '../auth/constant/auth.constant';
import { TokenInfo } from './dto/token.info';
import { setUserAuth } from '../auth/setUserAuth';
import { UsersApi } from '../api/UsersApi';
import { axiosErrorHandle } from '../error/axiosErrorHandle';

const Login = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [userInput, setUserInput] = useState({
    username: '',
    password: '',
  });

  const userInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios
      .post<TokenInfo>(UsersApi.LOGIN, userInput)
      .then((response) => {
        localStorage.setItem(
          AuthConstant.ACCESS_TOKEN,
          response.data.accessToken,
        );
        localStorage.setItem(
          AuthConstant.REFRESH_TOKEN,
          response.data.refreshToken,
        );
      })
      .catch((error: any) => {
        axiosErrorHandle(error);
      });
    setIsSubmitted(true);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await setUserAuth();
      if (isAuthenticated) {
        window.location.replace(UsersApi.BASE_URL + '/profile');
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="container">
      {!isSubmitted ? (
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="username">이메일</label>
            <input
              type="text"
              name="username"
              className="form-control"
              onChange={userInputHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={userInputHandler}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            로그인
          </button>
        </form>
      ) : (
        <div>
          <h2>환영합니다!</h2>
          <a href="/users/profile" className="btn btn-primary">
            프로필
          </a>
        </div>
      )}
    </div>
  );
};

export default Login;
