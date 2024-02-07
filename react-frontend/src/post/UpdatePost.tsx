import { ChangeEvent, FormEvent, useState } from 'react';
import { getAccessToken, getUserId } from '../auth/GetAuth';
import axios from 'axios';
import { PostApi } from '../api/PostApi';
import { AuthConstant } from '../auth/constant/auth.constant';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import { getLastParam } from '../util/GetLastParam';

const UpdatePost = () => {
  const [updateData, setUpdateData] = useState({
    writerId: getUserId(),
    content: '',
  });

  const inputContentHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUpdateData({
      ...updateData,
      [name]: value,
    });
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const param = getLastParam();
    await axios
      .patch(PostApi.UPDATE + param, updateData, {
        headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
      })
      .then((response) => {
        alert(response.data);
        window.location.replace(PostApi.BASE_URL + `/${param}`);
      })
      .catch((error: any) => {
        axiosErrorHandle(error);
      });
  };

  return (
    <div className="container">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="content">게시글</label>
          <textarea
            name="content"
            className="form-control"
            placeholder="게시글을 입력하세요."
            onChange={inputContentHandler}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          게시글 업데이트
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
