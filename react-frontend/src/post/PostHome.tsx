import axios from 'axios';
import { useEffect, useState } from 'react';
import { PostApi } from '../api/PostApi';
import { PostPageDto } from './dto/PostPageDto';
import { AuthConstant } from '../auth/constant/auth.constant';
import { getAccessToken } from '../auth/GetAuth';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import styled from 'styled-components';
import { FaPlus, FaSearch } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const PostCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 80%;
  max-width: 600px;
`;

const PostTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const PostDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
`;

const LoadMoreButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const CreatePostButton = styled.button`
  background-color: #1ed14b;
  color: #fff;
  padding: 12px 24px; /* 좀 더 크게 */
  border-radius: 20px; /* 양옆으로 살짝 긴 타원 */
  font-size: 20px; /* 폰트 크기 조절 */
  border: none;
  cursor: pointer;
  position: fixed;
  right: 20px;
  bottom: 60px; /* 아래로 조금 이동 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease; /* 애니메이션 효과 추가 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;

  &:hover {
    background-color: #218838;
    transform: scale(1.05); /* 마우스 오버시 약간 확대 */
  }
`;

const IconWrapper = styled.span`
  vertical-align: middle;
`;

const SearchIcon = styled.div`
  color: #666;
  font-size: 24px;
  cursor: pointer;
  position: fixed;
  left: 50px;
  bottom: 68px;
`;

const PostHome = () => {
  const [postList, setPostList] = useState<PostPageDto | null>(null);
  const [lastId, setLastId] = useState<bigint>(BigInt(0));

  const getPostPage = async (lastId: bigint = BigInt(0)) => {
    await axios
      .get<PostPageDto>(PostApi.ALL, {
        params: { lastId: lastId },
        headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
      })
      .then((response) => {
        const newData = response.data;
        const filteredNewData = newData.postPages.filter((newPost) =>
          postList
            ? !postList.postPages.some((oldPost) => oldPost.id === newPost.id)
            : true,
        );
        setPostList(
          postList
            ? {
                ...postList,
                postPages: [...postList.postPages, ...filteredNewData],
              }
            : newData,
        );
        setLastId(response.data.metadata.lastId);
      })
      .catch((error: any) => {
        axiosErrorHandle(error);
      });
  };

  useEffect(() => {
    getPostPage();
  }, []);

  const handlePostClick = (id: bigint) => {
    window.location.href = `/posts/${id}`;
  };

  const handlePostCreate = () => {
    window.location.href = '/posts/create';
  };

  const handleLoadMore = async () => {
    getPostPage(lastId);
  };

  const handleSearch = () => {
    window.location.href = PostApi.BASE_URL + '/search';
  };

  return (
    <Container>
      {postList &&
        postList.postPages.map((data) => (
          <PostCard key={data.id} onClick={() => handlePostClick(data.id)}>
            <PostTitle>{data.title}</PostTitle>
            <PostDetails>
              <span>{`작성자: ${data.writer_id}`}</span>
              <span>{new Date(data.created_date).toLocaleString()}</span>
            </PostDetails>
          </PostCard>
        ))}
      {lastId > BigInt(0) && (
        <LoadMoreButton onClick={handleLoadMore}>Load More</LoadMoreButton>
      )}
      <CreatePostButton onClick={handlePostCreate}>
        <IconWrapper>
          <FaPlus />
        </IconWrapper>
      </CreatePostButton>
      <SearchIcon onClick={handleSearch}>
        <FaSearch />
      </SearchIcon>
    </Container>
  );
};

export default PostHome;
