import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { PostEntity } from '../entities/post.entity';
import { PostOffsetPageDto } from '../dto/response/post-offset-page.dto';
import { PostOptimizedPageDto } from '../dto/response/post-optimized-page.dto';
export declare class PostRepository {
    private prisma;
    constructor(prisma: PrismaService);
    save(postEntity: PostEntity): Promise<void>;
    updateContentByIdAndWriterId(content: string, id: bigint, writerId: string): Promise<void>;
    deleteOneByIdAndWriterId(id: bigint, writerId: string): Promise<void>;
    findOneById(id: bigint): Promise<Post>;
    findAllOptimizedPostPage(lastId: bigint): Promise<PostOptimizedPageDto>;
    findOptimizedPostPageByWriterId(writerId: string, lastId: bigint): Promise<PostOptimizedPageDto>;
    searchOptimizedPostPageByTitle(title: string, lastId: bigint): Promise<PostOptimizedPageDto>;
    findAllPostPage(page: number): Promise<PostOffsetPageDto>;
    findPostPageByWriterId(writerId: string, page: number): Promise<PostOffsetPageDto>;
    searchPostPageByTitle(title: string, page: number): Promise<PostOffsetPageDto>;
}
