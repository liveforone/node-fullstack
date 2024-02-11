import { HttpException, HttpStatus } from '@nestjs/common';

export class PostException extends HttpException {
  constructor(postExcMsg: string, httpStatus: HttpStatus) {
    super(postExcMsg, httpStatus);
  }
}
