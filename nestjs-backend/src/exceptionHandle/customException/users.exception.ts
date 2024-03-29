import { HttpStatus } from '@nestjs/common';

export class UsersException extends Error {
  private httpStatus: HttpStatus;

  constructor(usersExcMsg: string, httpStatus: HttpStatus) {
    super(usersExcMsg);
    this.httpStatus = httpStatus;
  }

  getStatus() {
    return this.httpStatus;
  }
}
