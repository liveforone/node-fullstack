import { HttpException, HttpStatus } from '@nestjs/common';
export declare class PostException extends HttpException {
    constructor(postExcMsg: string, httpStatus: HttpStatus);
}
