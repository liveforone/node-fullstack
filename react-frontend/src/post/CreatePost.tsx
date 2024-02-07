import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { PostApi } from '../api/PostApi';
import { AuthConstant } from '../auth/constant/auth.constant';
import { getAccessToken, getUserId } from '../auth/GetAuth';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import styled from 'styled-components';

const Container = styled.div`
  width: 50%;
  margin: 0 auto;
`;

const Form = styled.form`
  margin-top: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const CreatePost = () => {
  const [inputData, setInputData] = useState({
    writerId: getUserId(),
    title: '',
    content: '',
  });

  const inputTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const inputContentHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios
      .post(PostApi.CREATE, inputData, {
        headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
      })
      .then((response) => {
        alert(response.data);
        window.location.replace(PostApi.BASE_URL);
      })
      .catch((error) => {
        axiosErrorHandle(error);
      });
  };

  return (
    <Container>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label htmlFor="title">제목</Label>
          <Input
            type="text"
            name="title"
            placeholder="제목"
            onChange={inputTitleHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="content">게시글</Label>
          <Textarea
            name="content"
            placeholder="게시글을 입력하세요"
            onChange={inputContentHandler}
          />
        </FormGroup>
        <Button type="submit">게시글 등록</Button>
      </Form>
    </Container>
  );
};

export default CreatePost;
