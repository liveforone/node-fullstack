import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/service/users.service';
import { SignupDto } from '../users/dto/request/signup.dto';
import { UpdatePwDto } from '../users/dto/request/update-password.dto';
import { isMatchPassword } from '../auth/util/password-encoder';
import { WithdrawDto } from '../users/dto/request/withdraw.dto';
import { describe } from 'node:test';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { UsersException } from 'src/exceptionHandle/customException/users.exception';

describe('UsersService Command Method Real DB Test', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  //global user info
  const username = 'user_test_username@gmail.com';

  afterEach(async () => {
    await prisma.users.deleteMany({
      where: { username: username },
    });
  });

  //db 커넥션을 닫아주어야한다.
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('signup', () => {
    it('회원가입 후 username으로 조회하여 검증', async () => {
      //given
      const pw = '1234';
      const signupRequest: SignupDto = {
        username,
        password: pw,
      };

      //when
      await service.signup(signupRequest);

      //then
      expect((await service.getOneByUsername(username)).username).toEqual(
        username,
      );
    });
  });

  describe('updatePassword', () => {
    it('비밀번호 업데이트 후 새로운 비밀번호가 업데이트 되었는지 검증', async () => {
      //given
      const pw = '1234';
      const signupRequest: SignupDto = {
        username,
        password: pw,
      };
      await service.signup(signupRequest);

      //when
      const newPw = '1111';
      const id = (await service.getOneByUsername(username)).id;
      const updatePwRequest: UpdatePwDto = {
        originalPw: pw,
        newPw: newPw,
      };
      await service.updatePassword(updatePwRequest, id);

      //then
      const foundPw = (await service.getOneById(id)).password;
      expect(async () => {
        await isMatchPassword(newPw, foundPw);
      }).toBeTruthy();
    });

    it('잘못된 비밀번호를 입력하면 UsersException이 발생한다.', async () => {
      //given
      const pw = '1234';
      const signupRequest: SignupDto = {
        username,
        password: pw,
      };
      await service.signup(signupRequest);

      const wrongPw = '999';
      const newPw = '1111';
      const id = (await service.getOneByUsername(username)).id;
      const updatePwRequest: UpdatePwDto = {
        originalPw: wrongPw,
        newPw: newPw,
      };

      //then
      await expect(async () => {
        await service.updatePassword(updatePwRequest, id);
      }).rejects.toThrow(UsersException);
    });
  });

  describe('withdraw', () => {
    it('회원 탈퇴 후 검증시, 회원이 존재하지 않아서 HttpException 발생해야함', async () => {
      //given
      const pw = '1234';
      const signupRequest: SignupDto = {
        username,
        password: pw,
      };
      await service.signup(signupRequest);

      //when
      const withdrawRequest: WithdrawDto = { password: pw };
      const id = (await service.getOneByUsername(username)).id;
      await service.withdraw(withdrawRequest, id);

      //then
      await expect(async () => {
        await service.getOneById(id);
      }).rejects.toThrow(HttpException);
    });

    it('회원 탈퇴시 비밀번호가 틀리면 HttpException 에러가 발생한다.', async () => {
      //given
      const pw = '1234';
      const signupRequest: SignupDto = {
        username,
        password: pw,
      };
      await service.signup(signupRequest);

      //then
      const wrongPw = '4444';
      const withdrawRequest: WithdrawDto = { password: wrongPw };
      const id = (await service.getOneByUsername(username)).id;
      expect(async () => {
        await service.withdraw(withdrawRequest, id);
      }).rejects.toThrow(HttpException);
    });
  });
});
