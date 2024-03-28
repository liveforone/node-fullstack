import { Inject, Injectable, Logger } from '@nestjs/common';
import { SignupDto } from '../dto/request/signup.dto';
import { UpdatePwDto } from '../dto/request/update-password.dto';
import { UsersEntity } from '../entities/users.entity';
import { WithdrawDto } from '../dto/request/withdraw.dto';
import { UsersServiceLog } from '../log/users-service.log';
import { UsersRepository } from '../repository/users.repository';
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

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClientType,
    private usersRepository: UsersRepository,
    private prisma: PrismaService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, password } = signupDto;
    const user = await UsersEntity.create(username, password);
    await this.usersRepository.save(user);
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
    const user = await this.usersRepository.findOneById(id);
    await validateUserPassword(withdrawDto.password, user.password);
    await this.usersRepository.deleteOneById(id);
    await this.redis.del(UsersCacheKey.USER_INFO + id);
    await this.redis.del(UsersCacheKey.REFRESH_TOKEN + id);
    this.logger.log(UsersServiceLog.WITHDRAW_SUCCESS + id);
  }

  async getOneByUsername(username: string) {
    return await this.usersRepository.findOneByUsername(username);
  }

  async getOneById(id: string) {
    return await this.usersRepository.findOneById(id);
  }

  async getOneDtoById(id: string) {
    const userInfoKey = UsersCacheKey.USER_INFO + id;
    const cachedUserInfo = await this.redis.get(userInfoKey);
    if (notExistInRedis(cachedUserInfo)) {
      const userInfo = await this.usersRepository.findOneUserInfoById(id);
      await this.redis.set(userInfoKey, JSON.stringify(userInfo));
      await this.redis.expire(userInfoKey, REDIS_GLOBAL_TTL);
      return userInfo;
    } else {
      return JSON.parse(cachedUserInfo);
    }
  }
}
