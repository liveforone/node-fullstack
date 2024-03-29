import { Test, TestingModule } from '@nestjs/testing';
import { ReplyService } from '../reply/service/reply.service';
import { ReplyRepository } from 'src/reply/repository/reply.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/service/users.service';
import { PostService } from 'src/post/service/post.service';
import { SignupDto } from 'src/users/dto/request/signup.dto';
import { CreatePostDto } from 'src/post/dto/request/create-post.dto';
import { CreateReplyDto } from 'src/reply/dto/request/create-reply.dto';
import { UpdateReplydto } from 'src/reply/dto/request/update-reply.dto';
import { RemoveReplyDto } from 'src/reply/dto/request/remove-reply.dto';
import { $Enums } from '@prisma/client';
import { RedisModule } from 'src/redis/redis.module';
import { HttpException } from '@nestjs/common';

describe('ReplyService Real DB Test', () => {
  let service: ReplyService;
  let repository: ReplyRepository;
  let usersService: UsersService;
  let postService: PostService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [
        ReplyService,
        ReplyRepository,
        UsersService,
        PostService,
        PrismaService,
      ],
    }).compile();

    service = module.get<ReplyService>(ReplyService);
    repository = module.get<ReplyRepository>(ReplyRepository);
    usersService = module.get<UsersService>(UsersService);
    postService = module.get<PostService>(PostService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  //global user info
  const post_writer_username = 'reply_test_post_writer_username@gmail.com';
  const reply_writer_username = 'reply_test_reply_writer_username@gmail.com';

  //post는 users에 on delete cascade가 걸려있어, 회원만 삭제하면 모두 삭제된다.
  //따라서 post를 작성한 회원을 삭제하여 모든 게시글을 삭제하고
  //reply는 post에 on delete cascade가 걸려있어, 게시글만 삭제하면 모두 삭제된다.
  //따라서 reply도 자동으로 삭제된다. 다만 reply를 생성한 회원은 DB에 남아있으므로, 해당 회원을 삭제한다.
  afterEach(async () => {
    await prisma.users.deleteMany({
      where: { username: post_writer_username },
    });
    await prisma.users.deleteMany({
      where: { username: reply_writer_username },
    });
  });

  //db 커넥션을 닫아주어야한다.
  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function createPost() {
    const signUpDto: SignupDto = {
      username: post_writer_username,
      password: '0000',
    };
    await usersService.signup(signUpDto);
    const title = 'test_title';
    const content = 'test_content';
    const userId = (await usersService.getOneByUsername(post_writer_username))
      .id;
    const createPostDto: CreatePostDto = {
      writerId: userId,
      title,
      content,
    };
    await postService.createPost(createPostDto);
    const postId = (
      await postService.getOptimizedPostPageByWriterId(userId, BigInt(0))
    ).postPages[0].id;
    return postId;
  }

  describe('createReply', () => {
    it('Reply 생성 후 post_id로 조회하여 검증', async () => {
      //given
      const signUpDto: SignupDto = {
        username: reply_writer_username,
        password: '1111',
      };
      await usersService.signup(signUpDto);
      const userId = (
        await usersService.getOneByUsername(reply_writer_username)
      ).id;
      const postId = await createPost();
      const content = 'test_reply';

      //when
      const createReplyDto: CreateReplyDto = {
        writerId: userId,
        postId: postId,
        content: content,
      };
      await service.createReply(createReplyDto);

      //then
      expect(
        (await service.getReplyPageByPostId(postId, BigInt(0))).replyPages[0]
          .content,
      ).toEqual(content);
    });
  });

  describe('updateReply', () => {
    it('reply 업데이트 후 content 비교하여 검증', async () => {
      //given
      const signUpDto: SignupDto = {
        username: reply_writer_username,
        password: '1111',
      };
      await usersService.signup(signUpDto);
      const userId = (
        await usersService.getOneByUsername(reply_writer_username)
      ).id;
      const postId = await createPost();
      const content = 'test_reply';
      const createReplyDto: CreateReplyDto = {
        writerId: userId,
        postId: postId,
        content: content,
      };
      await service.createReply(createReplyDto);

      //when
      const replyId = (await service.getReplyPageByPostId(postId, BigInt(0)))
        .replyPages[0].id;
      const updatedContent = 'updated_content';
      const updateReplyDto: UpdateReplydto = {
        writerId: userId,
        content: updatedContent,
      };
      await service.updateReply(updateReplyDto, replyId);

      //then
      const foundReply = await service.getOneById(replyId);
      expect(foundReply.content).toEqual(updatedContent);
      expect(foundReply.reply_state).toEqual($Enums.ReplyState.EDITED);
    });
  });

  describe('removeReply', () => {
    it('reply 삭제후 조회시 HttpException 예외 발생', async () => {
      //given
      const signUpDto: SignupDto = {
        username: reply_writer_username,
        password: '1111',
      };
      await usersService.signup(signUpDto);
      const userId = (
        await usersService.getOneByUsername(reply_writer_username)
      ).id;
      const postId = await createPost();
      const content = 'test_reply';
      const createReplyDto: CreateReplyDto = {
        writerId: userId,
        postId: postId,
        content: content,
      };
      await service.createReply(createReplyDto);

      //when
      const replyId = (await service.getReplyPageByPostId(postId, BigInt(0)))
        .replyPages[0].id;
      const removeReplyDto: RemoveReplyDto = {
        writerId: userId,
      };
      await service.removeReply(removeReplyDto, replyId);

      //then
      expect(async () => {
        await service.getOneById(replyId);
      }).rejects.toThrow(HttpException);
    });
  });
});
