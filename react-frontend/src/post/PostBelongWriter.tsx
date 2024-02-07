import { useEffect, useState } from 'react';
import { PostPageDto } from './dto/PostPageDto';
import axios from 'axios';
import { PostApi } from '../api/PostApi';
import { getAccessToken, getUserId } from '../auth/GetAuth';
import { AuthConstant } from '../auth/constant/auth.constant';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import styled from 'styled-components';

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

const PostBelongWriter = () => {
  const [postList, setPostList] = useState<PostPageDto | null>(null);
  const [lastId, setLastId] = useState<bigint>(BigInt(0));

  const getPostPage = async (lastId: bigint = BigInt(0)) => {
    await axios
      .get<PostPageDto>(PostApi.BELONG_WRITER + getUserId(), {
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

  const handleLoadMore = async () => {
    getPostPage(lastId);
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
    </Container>
  );
};

export default PostBelongWriter;
