import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostRepository } from './repository/post.repository';
import { PostController } from './controller/post.controller';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
