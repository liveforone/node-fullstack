import { HttpException, HttpStatus } from '@nestjs/common';
export declare class UsersException extends HttpException {
    constructor(usersExcMsg: string, httpStatus: HttpStatus);
}
