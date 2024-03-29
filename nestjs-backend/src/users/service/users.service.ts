import { Inject, Injectable, Logger } from '@nestjs/common';
import { SignupDto } from '../dto/request/signup.dto';
import { UpdatePwDto } from '../dto/request/update-password.dto';
import { UsersEntity } from '../entities/users.entity';
import { WithdrawDto } from '../dto/request/withdraw.dto';
import { UsersServiceLog } from '../log/users-service.log';
import { encodePassword } from 'src/auth/util/password-encoder';
import { validateUserPassword } from '../validator/users.validator';
import { UsersCacheKey } from 'src/redis/key/users-cache.key';
import { RedisClientType } from 'redis';
import {
  REDIS_CLIENT,
  REDIS_GLOBAL_TTL,
} from 'src/redis/constant/redis.constant';
import { notExistInRedis } from 'src/redis/util/redis.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateFoundData } from 'src/common/found-data.validator';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClientType,
    private prisma: PrismaService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, password } = signupDto;
    const user = await UsersEntity.create(username, password);
    await this.prisma.users.create({ data: user });

    this.logger.log(UsersServiceLog.SIGNUP_SUCCESS + username);
  }

  async updatePassword(updatePwDto: UpdatePwDto, id: string) {
    const { originalPw, newPw } = updatePwDto;

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: { id: id },
      });
      validateFoundData(user);

      await validateUserPassword(originalPw, user.password);
      await tx.users.update({
        data: { password: await encodePassword(newPw) },
        where: { id: id },
      });
    });

    this.logger.log(UsersServiceLog.UPDATE_PW_SUCCESS + id);
  }

  async withdraw(withdrawDto: WithdrawDto, id: string) {
    await this.prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({ where: { id: id } });
      validateFoundData(user);

      await validateUserPassword(withdrawDto.password, user.password);

      await tx.users.delete({ where: { id: id } });
    });

    await this.redis.del(UsersCacheKey.USER_INFO + id);
    await this.redis.del(UsersCacheKey.REFRESH_TOKEN + id);
    this.logger.log(UsersServiceLog.WITHDRAW_SUCCESS + id);
  }

  async getOneByUsername(username: string) {
    const user = await this.prisma.users.findUnique({
      where: { username: username },
    });
    validateFoundData(user);

    return user;
  }

  async getOneById(id: string): Promise<Users> {
    const user = await this.prisma.users.findUnique({
      where: { id: id },
    });
    validateFoundData(user);

    return user;
  }

  async getOneDtoById(id: string): Promise<any> {
    const userInfoKey = UsersCacheKey.USER_INFO + id;
    const cachedUserInfo = await this.redis.get(userInfoKey);

    if (notExistInRedis(cachedUserInfo)) {
      const userInfo = await this.prisma.users.findUnique({
        select: { id: true, username: true, role: true },
        where: { id: id },
      });
      validateFoundData(userInfo);

      await this.redis.set(userInfoKey, JSON.stringify(userInfo));
      await this.redis.expire(userInfoKey, REDIS_GLOBAL_TTL);

      return userInfo;
    }

    return JSON.parse(cachedUserInfo);
  }
}
