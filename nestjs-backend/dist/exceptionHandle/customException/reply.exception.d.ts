import { HttpException, HttpStatus } from '@nestjs/common';
import { ReplyExcMsg } from '../exceptionMessage/reply.exception.message';
export declare class ReplyException extends HttpException {
    constructor(replyExcMsg: ReplyExcMsg, httpStatus: HttpStatus);
}
