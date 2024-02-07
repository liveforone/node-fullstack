import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    //class-validator는 BadRequestException을 throw 한다.
    if (exception instanceof BadRequestException) {
      const response = host.switchToHttp().getResponse();
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      response.status(status).json({
        message: exception.message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
