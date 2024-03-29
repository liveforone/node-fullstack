import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../post/service/post.service';
import { PostRepository } from '../post/repository/post.repository';
import { UsersService } from 'src/users/service/users.service';
import { UsersRepository } from 'src/users/repository/users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from 'src/users/dto/request/signup.dto';
import { CreatePostDto } from '../post/dto/request/create-post.dto';
import { UpdatePostDto } from '../post/dto/request/update-post.dto';
import { $Enums, Prisma } from '@prisma/client';
import { RemovePostDto } from '../post/dto/request/remove-post.dto';
import { HttpException } from '@nestjs/common';

describe('PostService Real DB Test', () => {
  let service: PostService;
  let repository: PostRepository;
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        PostRepository,
        UsersService,
        UsersRepository,
        PrismaService,
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<PostRepository>(PostRepository);
    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  //global user info
  const username = 'post_test_username@gmail.com';

  //post는 users에 on delete cascade가 걸려있어, 회원만 삭제하면 모두 삭제된다.
  afterEach(async () => {
    await prisma.users.deleteMany({
      where: { username: username },
    });
  });

  //db 커넥션을 닫아주어야한다.
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createPost', () => {
    it('게시글 생성 후 회원 id로 조회하여 검증', async () => {
      //given
      const pw = '0000';
      const signUpDto: SignupDto = {
        username,
        password: pw,
      };
      await usersService.signup(signUpDto);
      const title = 'test_title';
      const content = 'test_content';
      const userId = (await usersService.getOneByUsername(username)).id;

      //when
      const createPostDto: CreatePostDto = {
        writerId: userId,
        title,
        content,
      };
      await service.createPost(createPostDto);

      //then
      expect(
        (await service.getOptimizedPostPageByWriterId(userId, BigInt(0)))
          .postPages[0].title,
      ).toEqual(title);
    });
  });

  describe('updateContent', () => {
    it('content를 변경한 후, content와 post_state를 검증한다.', async () => {
      //given
      const pw = '0000';
      const signUpDto: SignupDto = {
        username,
        password: pw,
      };
      await usersService.signup(signUpDto);
      const title = 'test_title';
      const content = 'test_content';
      const userId = (await usersService.getOneByUsername(username)).id;
      const createPostDto: CreatePostDto = {
        writerId: userId,
        title,
        content,
      };
      await service.createPost(createPostDto);

      //when
      const updatedContent = 'updatedContent';
      const updatePostDto: UpdatePostDto = {
        writerId: userId,
        content: updatedContent,
      };
      const postId = (
        await service.getOptimizedPostPageByWriterId(userId, BigInt(0))
      ).postPages[0].id;
      await service.updateContent(updatePostDto, postId);

      //then
      const foundPost = await service.getPostById(postId);
      expect(foundPost.content).toEqual(updatedContent);
      expect(foundPost.post_state).toEqual($Enums.PostState.EDITED);
    });

    it('잘못된 writer_id를 사용했을때 PostException 발생', async () => {
      //given
      const pw = '0000';
      const signUpDto: SignupDto = {
        username,
        password: pw,
      };
      await usersService.signup(signUpDto);
      const title = 'test_title';
      const content = 'test_content';
      const userId = (await usersService.getOneByUsername(username)).id;
      const createPostDto: CreatePostDto = {
        writerId: userId,
        title,
        content,
      };
      await service.createPost(createPostDto);

      //then
      const updatedContent = 'updatedContent';
      const wrongWriterId = 'dsjkflsdjflskfsjdl';
      const updatePostDto: UpdatePostDto = {
        writerId: wrongWriterId,
        content: updatedContent,
      };
      const postId = (
        await service.getOptimizedPostPageByWriterId(userId, BigInt(0))
      ).postPages[0].id;
      expect(async () => {
        await service.updateContent(updatePostDto, postId);
      }).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe('removePost', () => {
    it('게시글 삭제 후 조회시 HttpException 예외발생', async () => {
      //given
      const pw = '0000';
      const signUpDto: SignupDto = {
        username,
        password: pw,
      };
      await usersService.signup(signUpDto);
      const title = 'test_title';
      const content = 'test_content';
      const userId = (await usersService.getOneByUsername(username)).id;
      const createPostDto: CreatePostDto = {
        writerId: userId,
        title,
        content,
      };
      await service.createPost(createPostDto);

      //when
      const removePostDto: RemovePostDto = {
        writerId: userId,
      };
      const postId = (
        await service.getOptimizedPostPageByWriterId(userId, BigInt(0))
      ).postPages[0].id;
      await service.removePost(removePostDto, postId);

      //then
      expect(async () => {
        await service.getPostById(postId);
      }).rejects.toThrow(HttpException);
    });

    it('잘못된 writer_id를 사용할때 PostException 발생', async () => {
      //given
      const pw = '0000';
      const signUpDto: SignupDto = {
        username,
        password: pw,
      };
      await usersService.signup(signUpDto);
      const title = 'test_title';
      const content = 'test_content';
      const userId = (await usersService.getOneByUsername(username)).id;
      const createPostDto: CreatePostDto = {
        writerId: userId,
        title,
        content,
      };
      await service.createPost(createPostDto);

      //then
      const wrongWriterId = 'dlsjfldsjflks';
      const removePostDto: RemovePostDto = {
        writerId: wrongWriterId,
      };
      const postId = (
        await service.getOptimizedPostPageByWriterId(userId, BigInt(0))
      ).postPages[0].id;
      expect(async () => {
        await service.removePost(removePostDto, postId);
      }).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe('searchOptimizedPostPageByTitle', () => {
    it('title의 첫글자로 검색후 검증', async () => {
      //given
      const pw = '0000';
      const signUpDto: SignupDto = {
        username,
        password: pw,
      };
      await usersService.signup(signUpDto);
      const title = 'test_title';
      const content = 'test_content';
      const userId = (await usersService.getOneByUsername(username)).id;
      const createPostDto: CreatePostDto = {
        writerId: userId,
        title,
        content,
      };
      await service.createPost(createPostDto);

      //when
      const keyword = 'te';
      const postPages = (
        await service.searchOptimizedPostPageByTitle(keyword, BigInt(0))
      ).postPages;

      //then
      expect(postPages[0].title).toEqual(title);
    });
  });
});
