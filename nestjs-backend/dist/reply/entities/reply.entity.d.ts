export declare class ReplyEntity {
    writer_id: string;
    post_id: bigint;
    content: string;
    static create(writer_id: string, post_id: bigint, content: string): ReplyEntity;
}
