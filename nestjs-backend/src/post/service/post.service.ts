import { Injectable, Logger } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { RemovePostDto } from '../dto/request/remove-post.dto';
import { PostServiceLog } from '../log/post.service.log';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(private postRepository: PostRepository) {}

  async createPost(createPostDto: CreatePostDto) {
    const { writerId: writerId, title, content } = createPostDto;
    await this.postRepository.save(PostEntity.create(title, content, writerId));
    this.logger.log(PostServiceLog.CREATE_POST_SUCCESS + writerId);
  }

  async updateContent(updatePostDto: UpdatePostDto, id: bigint) {
    const { writerId, content } = updatePostDto;
    await this.postRepository.updateContentByIdAndWriterId(
      content,
      id,
      writerId,
    );
    this.logger.log(PostServiceLog.UPDATE_POST_SUCCESS + id);
  }

  async removePost(removePostDto: RemovePostDto, id: bigint) {
    await this.postRepository.deleteOneByIdAndWriterId(
      id,
      removePostDto.writerId,
    );
    this.logger.log(PostServiceLog.REMOVE_POST_SUCCESS + id);
  }

  async getPostById(id: bigint) {
    return await this.postRepository.findOneById(id);
  }

  async getAllOptimizedPostPage(lastId: bigint) {
    return await this.postRepository.findAllOptimizedPostPage(lastId);
  }

  async getOptimizedPostPageByWriterId(writerId: string, lastId: bigint) {
    return await this.postRepository.findOptimizedPostPageByWriterId(
      writerId,
      lastId,
    );
  }

  async searchOptimizedPostPageByTitle(title: string, lastId: bigint) {
    return await this.postRepository.searchOptimizedPostPageByTitle(
      title,
      lastId,
    );
  }

  async getAllPostPage(page: number) {
    return await this.postRepository.findAllPostPage(page);
  }

  async getPostPageByWriterId(writerId: string, page: number) {
    return await this.postRepository.findPostPageByWriterId(writerId, page);
  }

  async searchPostPageByTitle(title: string, page: number) {
    return await this.postRepository.searchPostPageByTitle(title, page);
  }
}
