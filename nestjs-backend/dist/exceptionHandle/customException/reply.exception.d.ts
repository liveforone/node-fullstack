import { HttpException, HttpStatus } from '@nestjs/common';
export declare class ReplyException extends HttpException {
    constructor(replyExcMsg: string, httpStatus: HttpStatus);
}
