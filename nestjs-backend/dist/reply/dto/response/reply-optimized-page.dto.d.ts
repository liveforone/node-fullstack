import { ReplyPage } from './reply-page.dto';
export interface ReplyOptimizedPageDto {
    readonly replyPages: ReplyPage[];
    readonly metadata: {
        readonly lastId: bigint;
    };
}
