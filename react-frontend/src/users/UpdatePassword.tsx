import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { UsersApi } from '../api/UsersApi';
import { AuthConstant } from '../auth/constant/auth.constant';
import { getAccessToken } from '../auth/GetAuth';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import { removeToken } from '../auth/RemoveAuth';

const UpdatePassword = () => {
  const [inputPassword, setInputPassword] = useState({
    originalPw: '',
    newPw: '',
  });

  const inputPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputPassword({
      ...inputPassword,
      [name]: value,
    });
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.patch(
        UsersApi.UPDATE_PASSWORD,
        inputPassword,
        {
          headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
        },
      );
      alert(response.data);
      removeToken();
      window.location.replace(UsersApi.BASE_URL + '/login');
    } catch (error) {
      axiosErrorHandle(error);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label htmlFor="originalPw">기존 비밀번호</label>
        <input
          type="password"
          name="originalPw"
          className="form-control"
          placeholder="기존 비밀번호를 입력하세요"
          onChange={inputPasswordHandler}
        />
      </div>
      <div className="form-group">
        <label htmlFor="newPw">새 비밀번호</label>
        <input
          type="password"
          name="newPw"
          className="form-control"
          placeholder="새 비밀번호를 입력하세요"
          onChange={inputPasswordHandler}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        비밀번호 변경
      </button>
    </form>
  );
};

export default UpdatePassword;
