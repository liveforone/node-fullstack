import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersExcMsg } from '../exceptionMessage/users.exception.message';
export declare class UsersException extends HttpException {
    constructor(usersExcMsg: UsersExcMsg, httpStatus: HttpStatus);
}
