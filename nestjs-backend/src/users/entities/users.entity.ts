import { encodePassword } from 'src/auth/util/password-encoder';
import { UsersConstant } from './constant/users.constant';
import { $Enums } from '@prisma/client';

export class UsersEntity {
  username: string;
  password: string;
  role: $Enums.Role;

  static async create(username: string, password: string) {
    const user = new UsersEntity();
    user.username = username;
    user.password = await encodePassword(password);
    user.role =
      username == UsersConstant.ADMIN_USERNAME
        ? $Enums.Role.ADMIN
        : $Enums.Role.MEMBER;
    return user;
  }
}
