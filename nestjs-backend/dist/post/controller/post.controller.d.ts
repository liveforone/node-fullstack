import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { RemovePostDto } from '../dto/request/remove-post.dto';
import { Cache } from '@nestjs/cache-manager';
export declare class PostController {
    private readonly postService;
    private cacheManger;
    constructor(postService: PostService, cacheManger: Cache);
    allPosts(lastId?: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    belongWriter(writerId: string, lastId?: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    searchPosts(keyword: string, lastId?: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    allPostsOffset(page?: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
    belongWriterOffset(writerId: string, page?: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
    searchPostsOffset(keyword: string, page?: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
    detail(id: bigint): Promise<{
        id: bigint;
        title: string;
        content: string;
        post_state: import(".prisma/client").$Enums.PostState;
        writer_id: string;
        created_date: Date;
    }>;
    createPost(createPostDto: CreatePostDto): Promise<"게시글 등록에 성공하였습니다.">;
    updatePost(id: bigint, updatePostDto: UpdatePostDto): Promise<"게시글 수정에 성공하였습니다.">;
    removePost(id: bigint, removePostDto: RemovePostDto): Promise<"게시글 삭제에 성공하였습니다.">;
}
