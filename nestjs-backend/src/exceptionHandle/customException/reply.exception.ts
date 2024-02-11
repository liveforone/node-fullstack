import { HttpException, HttpStatus } from '@nestjs/common';

export class ReplyException extends HttpException {
  constructor(replyExcMsg: string, httpStatus: HttpStatus) {
    super(replyExcMsg, httpStatus);
  }
}
