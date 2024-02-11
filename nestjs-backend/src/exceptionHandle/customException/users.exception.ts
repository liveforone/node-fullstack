import { HttpException, HttpStatus } from '@nestjs/common';

export class UsersException extends HttpException {
  constructor(usersExcMsg: string, httpStatus: HttpStatus) {
    super(usersExcMsg, httpStatus);
  }
}
