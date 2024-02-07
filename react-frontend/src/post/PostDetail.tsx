import axios from 'axios';
import { useEffect, useState } from 'react';
import { PostApi } from '../api/PostApi';
import { AuthConstant } from '../auth/constant/auth.constant';
import { getAccessToken, getUserId } from '../auth/GetAuth';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import styled from 'styled-components';
import { FaComment, FaEdit, FaTrash } from 'react-icons/fa';
import { getLastParam } from '../util/GetLastParam';
import { Link } from 'react-router-dom';

interface PostInfo {
  id: string;
  title: string;
  content: string;
  post_state: string;
  writer_id: string;
  created_date: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  color: #333; /* 전체 글자 색 (다크 그레이) */
`;

const PostBlock = styled.div`
  width: 60%;
  padding: 20px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  font-size: 30px;
  text-align: center;
  color: #333; /* 제목 글자 색 (다크 그레이) */
`;

const SubInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const LeftInfo = styled.div`
  flex-grow: 1;
  font-size: 14px;
`;

const RightInfo = styled.div`
  flex-grow: 1;
  text-align: right;
  font-size: 14px;
`;

const Content = styled.textarea`
  font-size: 22px;
  margin-top: 20px;
  width: calc(100% - 20px); /* 좌우에 10px의 여백을 제공 */
  padding: 10px;
  border: 2px solid #ccc; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 테두리 설정 */
  resize: vertical; /* 세로로만 resize 가능하도록 설정 */
  color: #555; /* 컨텐츠 글자 색 (보다 밝은 그레이) */
  outline: none; /* 포커스시 테두리 제거 */
  transition: border-color 0.3s ease; /* 포커스시 테두리 색 변경 애니메이션 */

  &:focus {
    border-color: #007bff; /* 포커스시 테두리 색 변경 */
  }
`;

const EditIcon = styled(FaEdit)`
  color: black;
  cursor: pointer;
  margin-right: 10px; /* 버튼을 조금 띄우기 */
  font-size: 20px; /* 아이콘 크기 키우기 */
`;

const DeleteIcon = styled(FaTrash)`
  color: red;
  cursor: pointer;
  margin-left: 10px; /* 버튼을 조금 띄우기 */
  font-size: 20px; /* 아이콘 크기 키우기 */
`;

const CommentLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #333;
  background-color: #f9f9f9;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e3e3e3;
  }

  svg {
    margin-right: 10px;
  }
`;

const PostDetail = () => {
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);
  const userId = getUserId();

  useEffect(() => {
    const getPostInfo = async () => {
      const param = getLastParam();
      await axios
        .get<PostInfo>(PostApi.DETAIL + param, {
          headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
        })
        .then((response) => {
          setPostInfo(response.data);
        })
        .catch((error: any) => {
          axiosErrorHandle(error);
        });
    };
    getPostInfo();
  }, []);

  const handleEditClick = () => {
    window.location.href = PostApi.BASE_URL + `/update/${postInfo.id}`;
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm('게시글을 삭제하시겠습니까?');

    if (confirmDelete) {
      await axios
        .delete(PostApi.REMOVE + postInfo.id, {
          data: { writerId: getUserId() },
          headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
        })
        .then((response) => {
          alert(response.data);
          window.location.replace(PostApi.BASE_URL);
        })
        .catch((error: any) => {
          axiosErrorHandle(error);
        });
    } else {
      alert('게시글 삭제가 취소되었습니다.');
    }
  };

  return (
    <Container>
      {postInfo && (
        <PostBlock>
          <div>ID: {postInfo.id}</div>
          <Title>{postInfo.title}</Title>
          <div>Post State: {postInfo.post_state}</div>
          <SubInfo>
            <LeftInfo>Writer: {postInfo.writer_id}</LeftInfo>
            <RightInfo>Created Date: {postInfo.created_date}</RightInfo>
          </SubInfo>
          <Content readOnly value={postInfo.content} />
          <CommentLink to={`/reply/belong-post/${postInfo.id}`}>
            <FaComment />
          </CommentLink>
          {userId === postInfo.writer_id && (
            <div>
              <EditIcon onClick={handleEditClick} />
              <DeleteIcon onClick={handleDeleteClick} />
            </div>
          )}
        </PostBlock>
      )}
    </Container>
  );
};

export default PostDetail;
