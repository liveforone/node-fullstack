import { ReplyService } from '../service/reply.service';
import { CreateReplyDto } from '../dto/request/create-reply.dto';
import { UpdateReplydto } from '../dto/request/update-reply.dto';
import { RemoveReplyDto } from '../dto/request/remove-reply.dto';
export declare class ReplyController {
    private readonly replyService;
    constructor(replyService: ReplyService);
    getReplydetailInfo(id: bigint): Promise<{
        id: bigint;
        writer_id: string;
        post_id: bigint;
        content: string;
        reply_state: import(".prisma/client").$Enums.ReplyState;
        created_date: Date;
    }>;
    getRepliesBelongPostPage(postId: bigint, lastId?: bigint): Promise<import("../dto/response/reply-optimized-page.dto").ReplyOptimizedPageDto>;
    createReply(createReplyDto: CreateReplyDto): Promise<"댓글 등록에 성공하였습니다.">;
    updateReply(updateReplyDto: UpdateReplydto, id: bigint): Promise<"댓글 수정에 성공하였습니다.">;
    removeReply(removeReplyDto: RemoveReplyDto, id: bigint): Promise<"댓글 삭제에 성공하였습니다.">;
}
