import { HttpStatus, Injectable } from '@nestjs/common';
import { PostRepoConstant } from './constant/post.repository.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Post } from '@prisma/client';
import { PostEntity } from '../entities/post.entity';
import { PostException } from 'src/exceptionHandle/customException/post.exception';
import { PostExcMsg } from 'src/exceptionHandle/exceptionMessage/post.exception.message';
import { PostPage } from '../dto/response/post-page.dto';
import { getOffset, pageInitialize } from 'src/common/page.util';
import { PostOffsetPageDto } from '../dto/response/post-offset-page.dto';
import { PostOptimizedPageDto } from '../dto/response/post-optimized-page.dto';
import { findLastIdOrDefault, ltLastIdCondition } from 'prisma-no-offset';
import { validateFoundData } from 'src/common/validate.found-data';
import { PrismaCommonErrCode } from 'src/exceptionHandle/exceptionMessage/global.exception.message';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  /*
  data가 객체가 아니라 data: {key1: val1..}이었다면
  data: { key1: val1, writer: { connect: { id: id } },
  와 같은식으로 처리하면 된다.
  그런데 그것이 아니라 외래키를 직접 삽입할 수 있으면 삽입하면 된다.
  그럼 자동으로 연관관계 매핑이 이루어진다.
  */
  async save(postEntity: PostEntity) {
    //유니크 제약 조건 위반 사항 없음
    await this.prisma.post.create({
      data: postEntity,
    });
  }

  async updateContentByIdAndWriterId(
    content: string,
    id: bigint,
    writerId: string,
  ) {
    await this.prisma.post
      .update({
        data: { content: content, post_state: $Enums.PostState.EDITED },
        where: { id: id, writer_id: writerId },
      })
      .catch((err) => {
        let message: string;
        let status: HttpStatus;

        if (err.code === PrismaCommonErrCode.RECORD_NOT_FOUND) {
          message = PostExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST;
          status = HttpStatus.BAD_REQUEST;
        } else {
          message = err.message;
          status = HttpStatus.BAD_REQUEST;
        }
        throw new PostException(message, status);
      });
  }

  async deleteOneByIdAndWriterId(id: bigint, writerId: string) {
    await this.prisma.post
      .delete({
        where: { id: id, writer_id: writerId },
      })
      .catch((err) => {
        let message: string;
        let status: HttpStatus;

        if (err.code === PrismaCommonErrCode.RECORD_NOT_FOUND) {
          message = PostExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST;
          status = HttpStatus.BAD_REQUEST;
        } else {
          message = err.message;
          status = HttpStatus.BAD_REQUEST;
        }
        throw new PostException(message, status);
      });
  }

  async findOneById(id: bigint): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: id },
    });
    validateFoundData(post);
    return post;
  }

  //==no offset paging(optimization paging) start==//

  async findAllOptimizedPostPage(
    lastId: bigint,
  ): Promise<PostOptimizedPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE,
    });
    return {
      postPages: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }

  async findOptimizedPostPageByWriterId(
    writerId: string,
    lastId: bigint,
  ): Promise<PostOptimizedPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: {
        AND: [{ writer_id: writerId }, lastIdCondition],
      },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE,
    });
    return {
      postPages: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }

  async searchOptimizedPostPageByTitle(
    title: string,
    lastId: bigint,
  ): Promise<PostOptimizedPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: { AND: [{ title: { startsWith: title } }, lastIdCondition] },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE,
    });
    return {
      postPages: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }

  //==no offset paging(optimization paging) end==//

  //==offset based paging start==//

  async findAllPostPage(page: number): Promise<PostOffsetPageDto> {
    page = pageInitialize(page);
    const posts: PostPage[] = await this.prisma.post.findMany({
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE,
      skip: getOffset(page, PostRepoConstant.PAGE_SIZE),
    });
    return {
      postPages: posts,
      metadata: { pageNumber: page },
    };
  }

  async findPostPageByWriterId(
    writerId: string,
    page: number,
  ): Promise<PostOffsetPageDto> {
    page = pageInitialize(page);
    const posts = await this.prisma.post.findMany({
      where: { writer_id: writerId },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE,
      skip: getOffset(page, PostRepoConstant.PAGE_SIZE),
    });
    return {
      postPages: posts,
      metadata: { pageNumber: page },
    };
  }

  async searchPostPageByTitle(
    title: string,
    page: number,
  ): Promise<PostOffsetPageDto> {
    page = pageInitialize(page);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: { title: { startsWith: title } },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE,
      skip: getOffset(page, PostRepoConstant.PAGE_SIZE),
    });
    return {
      postPages: posts,
      metadata: { pageNumber: page },
    };
  }
  //==offset based paging end==//
}
