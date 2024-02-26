import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import { PostUrl } from './constant/post.url';
import { PostControllerConstant } from './constant/post.controller.constant';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { RemovePostDto } from '../dto/request/remove-post.dto';
import { PostResponse } from './response/post.controller.response';
import { DEFAULT_LAST_ID, LAST_ID } from 'prisma-no-offset';
import { FIRST_PAGE, PAGE } from 'src/common/page.util';
import { CACHE_MANAGER, Cache, CacheInterceptor } from '@nestjs/cache-manager';
import { PostCacheKey } from 'src/cache/key/post.cache.key';

@Controller(PostUrl.ROOT)
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(CACHE_MANAGER)
    private cacheManger: Cache,
  ) {}

  @Get()
  async getAllPostsPage(@Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID) {
    return this.postService.getAllOptimizedPostPage(lastId);
  }

  @Get(PostUrl.BELONG_WRITER)
  async getBelongWriterPage(
    @Param(PostControllerConstant.WRITER_ID) writerId: string,
    @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID,
  ) {
    return await this.postService.getOptimizedPostPageByWriterId(
      writerId,
      lastId,
    );
  }

  @Get(PostUrl.SEARCH_POSTS)
  async getSearchPostsPage(
    @Query(PostControllerConstant.KEYWORD) keyword: string,
    @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID,
  ) {
    return await this.postService.searchOptimizedPostPageByTitle(
      keyword,
      lastId,
    );
  }

  @Get(PostUrl.ALL_OFFSET)
  async getAllPostsOffsetPage(@Query(PAGE) page: number = FIRST_PAGE) {
    return await this.postService.getAllPostPage(page);
  }

  @Get(PostUrl.BELONG_WRITER_OFFSET)
  async getBelongWriterOffsetPage(
    @Param(PostControllerConstant.WRITER_ID) writerId: string,
    @Query(PAGE) page: number = FIRST_PAGE,
  ) {
    return await this.postService.getPostPageByWriterId(writerId, page);
  }

  @Get(PostUrl.SEARCH_POSTS_OFFSET)
  async getSearchPostsOffsetPage(
    @Query(PostControllerConstant.KEYWORD) keyword: string,
    @Query(PAGE) page: number = FIRST_PAGE,
  ) {
    return await this.postService.searchPostPageByTitle(keyword, page);
  }

  @UseInterceptors(CacheInterceptor)
  @Get(PostUrl.DETAIL)
  async postDetailInfo(@Param(PostControllerConstant.ID) id: bigint) {
    return await this.postService.getPostById(id);
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    await this.postService.createPost(createPostDto);
    return PostResponse.CREATE_POST_SUCCESS;
  }

  @Patch(PostUrl.UPDATE)
  async updatePost(
    @Param(PostControllerConstant.ID) id: bigint,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postService.updateContent(updatePostDto, id);
    await this.cacheManger.del(PostCacheKey.DETAIL + id);
    return PostResponse.UPDATE_POST_SUCCESS;
  }

  @Delete(PostUrl.REMOVE)
  async removePost(
    @Param(PostControllerConstant.ID) id: bigint,
    @Body() removePostDto: RemovePostDto,
  ) {
    await this.postService.removePost(removePostDto, id);
    await this.cacheManger.del(PostCacheKey.DETAIL + id);
    return PostResponse.DELETE_POST_SUCCESS;
  }
}
