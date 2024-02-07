import { HttpException, HttpStatus } from '@nestjs/common';
import { PostExcMsg } from '../exceptionMessage/post.exception.message';

export class PostException extends HttpException {
  constructor(postExcMsg: PostExcMsg, httpStatus: HttpStatus) {
    super(postExcMsg, httpStatus);
  }
}
