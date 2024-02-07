import { useEffect, useState } from 'react';
import { ReplyPageDto } from './dto/ReplyPageDto';
import axios from 'axios';
import { ReplyApi } from '../api/ReplyApi';
import { getLastParam } from '../util/GetLastParam';
import { AuthConstant } from '../auth/constant/auth.constant';
import { getAccessToken, getUserId } from '../auth/GetAuth';
import { axiosErrorHandle } from '../error/axiosErrorHandle';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CommentContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; // 가운데 정렬
`;

const CommentItem = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  width: 80%; // 너비 설정
`;

const CommentContent = styled.p`
  margin-bottom: 10px;
`;

const CommentButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const RoundedButton = styled.button`
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 20px;
  cursor: pointer;
`;

const EditButton = styled(RoundedButton)`
  background-color: #007bff;
  color: #fff;
`;

const DeleteButton = styled(RoundedButton)`
  background-color: #dc3545;
  color: #fff;
`;

const CreateButton = styled(RoundedButton)`
  background-color: #28a745;
  color: #fff;
  margin-bottom: 20px; // 아래 여백 추가
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 10px;
`;

const LoadMoreButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
`;

const NoCommentsMessage = styled.p`
  margin-top: 20px;
  font-style: italic;
  color: #888;
`;

const ReplyBelongPost = () => {
  const [replyPage, setReplyPage] = useState<ReplyPageDto | null>(null);
  const [lastId, setLastId] = useState<bigint>(BigInt(0));
  const [showModal, setShowModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<bigint | null>(null);
  const [editContent, setEditContent] = useState('');
  const [reply, setReply] = useState('');
  const userId = getUserId();

  const getReplyPage = async (lastId: bigint = BigInt(0)) => {
    await axios
      .get<ReplyPageDto>(ReplyApi.BELONG_POST + getLastParam(), {
        params: { lastId: lastId },
        headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
      })
      .then((response) => {
        const newData = response.data;
        const filterdNewData = newData.replyPages.filter((newReplies) =>
          replyPage
            ? !replyPage.replyPages.some(
                (oldReplies) => oldReplies.id === newReplies.id,
              )
            : true,
        );
        setReplyPage(
          replyPage
            ? {
                ...replyPage,
                replyPages: [...replyPage.replyPages, ...filterdNewData],
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
    getReplyPage();
  }, []);

  const handleLoadMore = async () => {
    getReplyPage(lastId);
  };

  const handleCreateComment = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReply('');
  };

  const handleSubmitComment = async () => {
    await axios
      .post(
        ReplyApi.CREATE,
        { writerId: userId, postId: BigInt(getLastParam()), content: reply },
        {
          headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
        },
      )
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((error: any) => {
        axiosErrorHandle(error);
      });
    setShowModal(false);
    setReply('');
  };

  const handleEdit = (id: bigint) => {
    const editComment = replyPage?.replyPages.find((reply) => reply.id === id);
    if (editComment) {
      setEditingCommentId(id);
      setEditContent(editComment.content);
    }
  };

  const handleEditSubmit = async (id: bigint) => {
    await axios
      .patch(
        ReplyApi.UPDATE + id,
        {
          writerId: userId,
          content: editContent,
        },
        { headers: { Authorization: AuthConstant.BEARER + getAccessToken() } },
      )
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((error: any) => {
        axiosErrorHandle(error);
      });
  };

  const handleDelete = async (id: bigint) => {
    const confirmDelete = window.confirm('댓글을 삭제하시겠습니까?');
    if (confirmDelete) {
      await axios
        .delete(ReplyApi.REMOVE + id, {
          data: { writerId: userId },
          headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
        })
        .then((response) => {
          alert(response.data);
          window.location.reload();
        })
        .catch((error: any) => {
          axiosErrorHandle(error);
        });
    }
  };

  return (
    <CommentContainer>
      <CreateButton onClick={handleCreateComment}>Create Comment</CreateButton>
      <hr />
      {replyPage &&
        replyPage.replyPages.map((data) => (
          <CommentItem key={data.id}>
            {editingCommentId === data.id ? ( // 수정 상태인 경우 수정 창을 보여줌
              <div>
                <CommentTextarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div>
                  <RoundedButton onClick={() => setEditingCommentId(null)}>
                    Cancel
                  </RoundedButton>
                  <RoundedButton onClick={() => handleEditSubmit(data.id)}>
                    Submit
                  </RoundedButton>
                </div>
              </div>
            ) : (
              <div>
                <CommentContent>{data.content}</CommentContent>
                <p>
                  Created Date: {new Date(data.created_date).toLocaleString()}
                </p>
                <p>Writer: {data.writer_id}</p>
                <p>Reply State: {data.reply_state}</p>
                {userId === data.writer_id && (
                  <CommentButtons>
                    <EditButton onClick={() => handleEdit(data.id)}>
                      <FaEdit />
                    </EditButton>
                    <DeleteButton onClick={() => handleDelete(data.id)}>
                      <FaTrash />
                    </DeleteButton>
                  </CommentButtons>
                )}
              </div>
            )}
          </CommentItem>
        ))}
      {replyPage && lastId > BigInt(0) && (
        <LoadMoreButton onClick={handleLoadMore}>Load More</LoadMoreButton>
      )}
      {replyPage && replyPage.replyPages.length === 0 && (
        <NoCommentsMessage>
          댓글이 아직 없습니다. 첫번째 댓글의 주인공이 되세요!
        </NoCommentsMessage>
      )}
      {showModal && (
        <ModalContainer>
          <CommentTextarea
            placeholder="Enter your comment..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div>
            <RoundedButton onClick={handleCloseModal}>Cancel</RoundedButton>
            <RoundedButton onClick={handleSubmitComment}>Submit</RoundedButton>
          </div>
        </ModalContainer>
      )}
    </CommentContainer>
  );
};

export default ReplyBelongPost;
