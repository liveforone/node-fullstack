import { HttpStatus } from '@nestjs/common';
import { isMatchPassword } from 'src/auth/util/PasswordEncoder';
import { UsersException } from 'src/exceptionHandle/customException/users.exception';
import { UsersExcMsg } from 'src/exceptionHandle/exceptionMessage/users.exception.message';

export const validateUserPassword = async (
  originalPw: string,
  encodedPw: string,
) => {
  if (!(await isMatchPassword(originalPw, encodedPw))) {
    throw new UsersException(
      UsersExcMsg.PASSWORD_IS_NOT_MATCH,
      HttpStatus.BAD_REQUEST,
    );
  }
};
