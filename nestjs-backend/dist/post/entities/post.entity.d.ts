export declare class PostEntity {
    title: string;
    content: string;
    writer_id: string;
    static create(title: string, content: string, writer_id: string): PostEntity;
}
