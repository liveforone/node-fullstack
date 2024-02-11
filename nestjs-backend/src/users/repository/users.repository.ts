import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepoConstant } from './constant/users.repository.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UsersEntity } from '../entities/users.entity';
import { validateFoundData } from 'src/common/validate.found-data';
import { UsersException } from 'src/exceptionHandle/customException/users.exception';
import { UsersExcMsg } from 'src/exceptionHandle/exceptionMessage/users.exception.message';
import { PrismaCommonErrCode } from 'src/exceptionHandle/exceptionMessage/global.exception.message';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async save(usersEntity: UsersEntity) {
    await this.prisma.users.create({ data: usersEntity }).catch((err) => {
      let message: string;
      let status: HttpStatus;

      if (err.code == PrismaCommonErrCode.UNIQUE_CONSTRAINTS_VIOLATION) {
        message = UsersExcMsg.USERNAME_UNIQUE_CONSTRAINTS_VIOLATION;
        status = HttpStatus.CONFLICT;
      } else {
        message = err.message;
        status = HttpStatus.BAD_REQUEST;
      }

      throw new HttpException(message, status);
    });
  }

  async updatePasswordById(newPassword: string, id: string) {
    await this.prisma.users
      .update({
        data: { password: newPassword },
        where: { id: id },
      })
      .catch((err) => {
        let message: string;
        let status: HttpStatus;

        if (err.code === PrismaCommonErrCode.RECORD_NOT_FOUND) {
          message = UsersExcMsg.USERS_ID_BAD_REQUEST;
          status = HttpStatus.BAD_REQUEST;
        } else {
          message = err.message;
          status = HttpStatus.BAD_REQUEST;
        }

        throw new UsersException(message, status);
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
      .catch((err) => {
        let message: string;
        let status: HttpStatus;

        if (err.code === PrismaCommonErrCode.RECORD_NOT_FOUND) {
          message = UsersExcMsg.USERS_ID_BAD_REQUEST;
          status = HttpStatus.BAD_REQUEST;
        } else {
          message = err.message;
          status = HttpStatus.BAD_REQUEST;
        }

        throw new UsersException(message, status);
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
