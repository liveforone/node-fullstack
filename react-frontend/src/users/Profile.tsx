import axios from 'axios';
import { useEffect, useState } from 'react';
import { UsersApi } from '../api/UsersApi';
import { AuthConstant } from '../auth/constant/auth.constant';
import { getAccessToken } from '../auth/GetAuth';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import styled from 'styled-components';

interface UsersInfo {
  id: string;
  username: string;
  role: string;
}

const Container = styled.div`
  background-color: #9ec2e6;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 30px;
  margin-bottom: 16px;
`;

const Info = styled.p`
  font-size: 18px;
  margin-bottom: 8px;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Link = styled.a`
  background-color: #f0c33c;
  color: black;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  margin-right: 10px;
  display: inline-block;

  &:hover {
    background-color: #f5e6ab;
  }
`;

const Profile = () => {
  const [profileData, setProfileData] = useState<UsersInfo | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      await axios
        .get<UsersInfo>(UsersApi.PROFILE, {
          headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
        })
        .then((response) => {
          setProfileData(response.data);
        })
        .catch((error: any) => {
          axiosErrorHandle(error);
        });
    };
    getProfile();
  }, []);
  return (
    <>
      <Container>
        {profileData && (
          <>
            <Title>나의 정보</Title>
            <Info>{profileData.username}</Info>
            <Info>{profileData.role}</Info>
          </>
        )}
      </Container>
      <LinkContainer>
        <Link href="/users/update/password">비밀번호 변경</Link>
        <Link href="/users/logout">로그아웃</Link>
        {profileData && (
          <Link href={`/posts/belong-writer/${profileData.id}`}>
            나의 게시글
          </Link>
        )}
      </LinkContainer>
    </>
  );
};

export default Profile;
