import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { RemovePostDto } from '../dto/request/remove-post.dto';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    getAllPostsPage(lastId?: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    getBelongWriterPage(writerId: string, lastId?: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    getSearchPostsPage(keyword: string, lastId?: bigint): Promise<import("../dto/response/post-optimized-page.dto").PostOptimizedPageDto>;
    getAllPostsOffsetPage(page?: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
    getBelongWriterOffsetPage(writerId: string, page?: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
    getSearchPostsOffsetPage(keyword: string, page?: number): Promise<import("../dto/response/post-offset-page.dto").PostOffsetPageDto>;
    postDetailInfo(id: bigint): Promise<any>;
    createPost(createPostDto: CreatePostDto): Promise<"게시글 등록에 성공하였습니다.">;
    updatePost(id: bigint, updatePostDto: UpdatePostDto): Promise<"게시글 수정에 성공하였습니다.">;
    removePost(id: bigint, removePostDto: RemovePostDto): Promise<"게시글 삭제에 성공하였습니다.">;
}
