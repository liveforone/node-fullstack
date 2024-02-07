import { PrismaService } from 'src/prisma/prisma.service';
import { ReplyEntity } from '../entities/reply.entity';
import { Reply } from '@prisma/client';
import { ReplyOptimizedPageDto } from '../dto/response/reply-optimized-page.dto';
export declare class ReplyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    save(reply: ReplyEntity): Promise<void>;
    updateReplyByIdAndWriterId(content: string, id: bigint, writer_id: string): Promise<void>;
    deleteOneByIdAndWriterId(id: bigint, writer_id: string): Promise<void>;
    findOneById(id: bigint): Promise<Reply>;
    findReplyPageByPostId(post_id: bigint, lastId: bigint): Promise<ReplyOptimizedPageDto>;
}
