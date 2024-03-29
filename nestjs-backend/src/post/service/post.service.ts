import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { RemovePostDto } from '../dto/request/remove-post.dto';
import { PostServiceLog } from '../log/post-service.log';
import { PostCacheKey } from 'src/redis/key/post-cache.key';
import {
  REDIS_CLIENT,
  REDIS_GLOBAL_TTL,
} from 'src/redis/constant/redis.constant';
import { RedisClientType } from 'redis';
import { notExistInRedis } from 'src/redis/util/redis.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { validateFoundData } from 'src/common/found-data.validator';
import { findLastIdOrDefault, ltLastIdCondition } from 'prisma-no-offset';
import { PostPage } from '../dto/response/post-page.dto';
import { PostQueryConstant } from './constant/post-repository.constant';
import { getOffset, pageInitialize } from 'src/common/page.util';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private redis: RedisClientType,
    private prisma: PrismaService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const { writerId: writerId, title, content } = createPostDto;
    await this.prisma.post.create({
      data: PostEntity.create(title, content, writerId),
    });
    this.logger.log(PostServiceLog.CREATE_POST_SUCCESS + writerId);
  }

  async updateContent(updatePostDto: UpdatePostDto, id: bigint) {
    const { writerId, content } = updatePostDto;
    await this.prisma.post.update({
      data: { content: content, post_state: $Enums.PostState.EDITED },
      where: { id: id, writer_id: writerId },
    });
    await this.redis.del(PostCacheKey.DETAIL + id);
    this.logger.log(PostServiceLog.UPDATE_POST_SUCCESS + id);
  }

  async removePost(removePostDto: RemovePostDto, id: bigint) {
    await this.prisma.post.delete({
      where: { id: id, writer_id: removePostDto.writerId },
    });
    await this.redis.del(PostCacheKey.DETAIL + id);
    this.logger.log(PostServiceLog.REMOVE_POST_SUCCESS + id);
  }

  async getPostById(id: bigint) {
    const redisKey = PostCacheKey.DETAIL + id;
    const cachedPostInfo = await this.redis.get(redisKey);

    if (notExistInRedis(cachedPostInfo)) {
      const postInfo = await this.prisma.post.findUnique({
        where: { id: id },
      });
      validateFoundData(postInfo);
      await this.redis.set(redisKey, JSON.stringify(postInfo));
      await this.redis.expire(redisKey, REDIS_GLOBAL_TTL);

      return postInfo;
    }

    return JSON.parse(cachedPostInfo);
  }

  async getAllOptimizedPostPage(lastId?: bigint) {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
    });

    return {
      postPages: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }

  async getOptimizedPostPageByWriterId(writerId: string, lastId: bigint) {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: {
        AND: [{ writer_id: writerId }, lastIdCondition],
      },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
    });

    return {
      postPages: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }

  async searchOptimizedPostPageByTitle(title: string, lastId: bigint) {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: { AND: [{ title: { startsWith: title } }, lastIdCondition] },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
    });

    return {
      postPages: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }

  async getAllPostPage(page: number) {
    page = pageInitialize(page);
    const posts: PostPage[] = await this.prisma.post.findMany({
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
      skip: getOffset(page, PostQueryConstant.PAGE_SIZE),
    });

    return {
      postPages: posts,
      metadata: { pageNumber: page },
    };
  }

  async getPostPageByWriterId(writerId: string, page: number) {
    page = pageInitialize(page);
    const posts = await this.prisma.post.findMany({
      where: { writer_id: writerId },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
      skip: getOffset(page, PostQueryConstant.PAGE_SIZE),
    });

    return {
      postPages: posts,
      metadata: { pageNumber: page },
    };
  }

  async searchPostPageByTitle(title: string, page: number) {
    page = pageInitialize(page);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: { title: { startsWith: title } },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
      skip: getOffset(page, PostQueryConstant.PAGE_SIZE),
    });

    return {
      postPages: posts,
      metadata: { pageNumber: page },
    };
  }
}
