import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaCommonErrCode } from '../exceptionMessage/global-exception.message';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message.replace(/\n/g, '');
    let status: HttpStatus;

    switch (exception.code) {
      case PrismaCommonErrCode.RECORD_NOT_FOUND:
        status = HttpStatus.NOT_FOUND;
        break;
      case PrismaCommonErrCode.UNIQUE_CONSTRAINTS_VIOLATION:
        status = HttpStatus.CONFLICT;
        break;
      default:
        status = HttpStatus.BAD_REQUEST;
        break;
    }

    response.status(status).json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
