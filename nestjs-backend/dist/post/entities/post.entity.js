"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
class PostEntity {
    static create(title, content, writer_id) {
        const post = new PostEntity();
        post.title = title;
        post.content = content;
        post.writer_id = writer_id;
        return post;
    }
}
exports.PostEntity = PostEntity;
//# sourceMappingURL=post.entity.js.map