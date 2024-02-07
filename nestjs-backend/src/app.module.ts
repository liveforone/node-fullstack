import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptionHandle/exceptionFilter/HttpExceptionFilter';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
import { JwtGuard } from './auth/guard/jwt.guard';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 3600000,
    }),
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
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}
