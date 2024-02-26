import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostRepository } from './repository/post.repository';
import { PostController } from './controller/post.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
