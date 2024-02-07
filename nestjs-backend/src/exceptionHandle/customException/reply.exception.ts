import { HttpException, HttpStatus } from '@nestjs/common';
import { ReplyExcMsg } from '../exceptionMessage/reply.exception.message';

export class ReplyException extends HttpException {
  constructor(replyExcMsg: ReplyExcMsg, httpStatus: HttpStatus) {
    super(replyExcMsg, httpStatus);
  }
}
