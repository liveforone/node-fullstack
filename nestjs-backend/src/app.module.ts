import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptionHandle/exceptionFilter/http-exception.filter';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
import { JwtGuard } from './auth/guard/jwt.guard';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReplyModule } from './reply/reply.module';
import { RedisModule } from './redis/redis.module';
import { PrismaClientExceptionFilter } from './exceptionHandle/exceptionFilter/prisma-client-exception.filter';
import { UsersExceptionFilterTsFilter } from './exceptionHandle/exceptionFilter/users-exception.filter.ts.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    RedisModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    PostModule,
    ReplyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
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
      useClass: UsersExceptionFilterTsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}
