import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PostPageDto } from './dto/PostPageDto';
import axios from 'axios';
import { PostApi } from '../api/PostApi';
import { AuthConstant } from '../auth/constant/auth.constant';
import { getAccessToken } from '../auth/GetAuth';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

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

  &:hover {
    background-color: #218838;
    transform: scale(1.05); /* 마우스 오버시 약간 확대 */
  }
`;

const IconWrapper = styled.span`
  vertical-align: middle;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  background-color: #f3f3f3;
  border-radius: 20px;
  padding: 5px 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  padding: 5px;
`;

const SearchIcon = styled.div`
  margin-right: 5px;
  color: #666;
`;

const PostSearch = () => {
  const [postList, setPostList] = useState<PostPageDto | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getSearchPostPage = async (
    lastId: bigint = BigInt(0),
    query: string,
  ) => {
    await axios
      .get<PostPageDto>(PostApi.SEARCH, {
        params: { keyword: query, lastId: lastId },
        headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
      })
      .then((response) => {
        const newData = response.data;
        if (lastId === BigInt(0)) {
          // If lastId is 0, it means it's a new search, so set the new data directly
          setPostList(newData);
        } else {
          // If lastId is not 0, it means it's a load more action, so append the new data
          setPostList((prevData) => ({
            ...prevData,
            postPages: [...prevData.postPages, ...newData.postPages],
            metadata: newData.metadata,
          }));
        }
      })
      .catch((error: any) => {
        axiosErrorHandle(error);
      });
  };

  const handlePostClick = (id: bigint) => {
    window.location.href = `/posts/${id}`;
  };

  const handlePostCreate = () => {
    window.location.href = '/posts/create';
  };

  const handleLoadMore = async () => {
    getSearchPostPage(postList.metadata.lastId, searchQuery);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    setPostList(null);
    await getSearchPostPage(BigInt(0), searchQuery);
  };

  return (
    <Container>
      <SearchBar>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="검색어를 입력하세요"
          onChange={handleSearchInputChange}
          value={searchQuery}
        />
        <button onClick={handleSearch}>검색</button>
      </SearchBar>
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
      {postList && postList.metadata.lastId > BigInt(0) && (
        <LoadMoreButton onClick={handleLoadMore}>Load More</LoadMoreButton>
      )}
      <CreatePostButton onClick={handlePostCreate}>
        <IconWrapper>
          <FaPlus />
        </IconWrapper>
      </CreatePostButton>
    </Container>
  );
};

export default PostSearch;
