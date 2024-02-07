import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersExcMsg } from '../exceptionMessage/users.exception.message';

export class UsersException extends HttpException {
  constructor(usersExcMsg: UsersExcMsg, httpStatus: HttpStatus) {
    super(usersExcMsg, httpStatus);
  }
}
