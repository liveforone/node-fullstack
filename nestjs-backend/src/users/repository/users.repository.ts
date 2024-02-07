import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepoConstant } from './constant/users.repository.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UsersEntity } from '../entities/users.entity';
import { GlobalExcMsg } from 'src/exceptionHandle/exceptionMessage/global.exception.message';
import { validateFoundData } from 'src/common/validate.found-data';
import { UsersException } from 'src/exceptionHandle/customException/users.exception';
import { UsersExcMsg } from 'src/exceptionHandle/exceptionMessage/users.exception.message';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async save(usersEntity: UsersEntity) {
    await this.prisma.users.create({ data: usersEntity }).catch((err) => {
      if (err.code == GlobalExcMsg.UNIQUE_CONSTRAINTS_CODE) {
        throw new HttpException(
          GlobalExcMsg.IGNORE_UNIQUE_CONSTRAINTS,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    });
  }

  async updatePasswordById(newPassword: string, id: string) {
    await this.prisma.users
      .update({
        data: { password: newPassword },
        where: { id: id },
      })
      .catch(() => {
        throw new UsersException(
          UsersExcMsg.USERS_ID_BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async addRefreshToken(username: string, refreshToken: string) {
    await this.prisma.users.updateMany({
      data: { refresh_token: refreshToken },
      where: { username: username },
    });
  }

  async reissueRefreshToken(reissuedRefreshToken: string, id: string) {
    await this.prisma.users.updateMany({
      data: { refresh_token: reissuedRefreshToken },
      where: { id: id },
    });
  }

  async removeRefreshToken(id: string) {
    await this.prisma.users.updateMany({
      data: { refresh_token: UsersRepoConstant.EMPTY_STRING },
      where: { id: id },
    });
  }

  async deleteOneById(id: string) {
    await this.prisma.users
      .delete({
        where: { id: id },
      })
      .catch(() => {
        throw new UsersException(
          UsersExcMsg.USERS_ID_BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async findOneByUsername(username: string): Promise<Users> {
    const user = await this.prisma.users.findUnique({
      where: { username: username },
    });
    validateFoundData(user);
    return user;
  }

  async findOneById(id: string): Promise<Users> {
    const user = await this.prisma.users.findUnique({
      where: { id: id },
    });
    validateFoundData(user);
    return user;
  }

  async findOneUserInfoById(id: string): Promise<any> {
    const userInfo = await this.prisma.users.findUnique({
      select: { id: true, username: true, role: true },
      where: { id: id },
    });
    validateFoundData(userInfo);
    return userInfo;
  }

  async findRefreshTokenById(id: string) {
    const refreshToken = await this.prisma.users.findUnique({
      select: { refresh_token: true },
      where: { id: id },
    });
    validateFoundData(refreshToken);
    return refreshToken;
  }
}
