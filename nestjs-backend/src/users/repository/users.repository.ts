import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UsersEntity } from '../entities/users.entity';
import { validateFoundData } from 'src/common/found-data.validator';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async save(usersEntity: UsersEntity) {
    await this.prisma.users.create({ data: usersEntity });
  }

  async deleteOneById(id: string) {
    await this.prisma.users.delete({
      where: { id: id },
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
}
