import { ReplyRepository } from '../repository/reply.repository';
import { CreateReplyDto } from '../dto/request/create-reply.dto';
import { UpdateReplydto } from '../dto/request/update-reply.dto';
import { RemoveReplyDto } from '../dto/request/remove-reply.dto';
export declare class ReplyService {
    private replyRepository;
    private readonly logger;
    constructor(replyRepository: ReplyRepository);
    createReply(createReplyDto: CreateReplyDto): Promise<void>;
    updateReply(updateReplyDto: UpdateReplydto, id: bigint): Promise<void>;
    removeReply(removeReplyDto: RemoveReplyDto, id: bigint): Promise<void>;
    getOneById(id: bigint): Promise<{
        id: bigint;
        writer_id: string;
        post_id: bigint;
        content: string;
        reply_state: import(".prisma/client").$Enums.ReplyState;
        created_date: Date;
    }>;
    getReplyPageByPostId(post_id: bigint, lastId: bigint): Promise<import("../dto/response/reply-optimized-page.dto").ReplyOptimizedPageDto>;
}
