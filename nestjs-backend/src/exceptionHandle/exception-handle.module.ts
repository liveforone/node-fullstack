import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptionFilter/http-exception.filter';
import { PrismaClientExceptionFilter } from './exceptionFilter/prisma-client-exception.filter';
import { UsersExceptionFilter } from './exceptionFilter/users-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UsersExceptionFilter,
    },
  ],
})
export class ExceptionHandleModule {}
