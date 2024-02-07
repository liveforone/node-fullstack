import { PostRepository } from '../repository/post.repository';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { RemovePostDto } from '../dto/request/remove-post.dto';
export declare class PostService {
    private postRepository;
    private readonly logger;
    constructor(postRepository: PostRepository);
    createPost(createPostDto: CreatePostDto): Promise<void>;
    updateContent(updatePostDto: UpdatePostDto, id: bigint): Promise<void>;
    removePost(removePostDto: RemovePostDto, id: bigint): Promise<void>;
    getPostById(id: bigint): Promise<{
        id: bigint;
        title: string;
        content: string;
        post_state: import(".prisma/client").$Enums.PostState;
        writer_id: string;
        created_date: Date;
    }>;
    getAllOptimizedPostPage(lastId: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    getOptimizedPostPageByWriterId(writerId: string, lastId: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    searchOptimizedPostPageByTitle(title: string, lastId: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    getAllPostPage(page: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
    getPostPageByWriterId(writerId: string, page: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
    searchPostPageByTitle(title: string, page: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
}
