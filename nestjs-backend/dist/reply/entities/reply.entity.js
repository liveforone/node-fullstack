"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyEntity = void 0;
class ReplyEntity {
    static create(writer_id, post_id, content) {
        const reply = new ReplyEntity();
        reply.writer_id = writer_id;
        reply.post_id = post_id;
        reply.content = content;
        return reply;
    }
}
exports.ReplyEntity = ReplyEntity;
//# sourceMappingURL=reply.entity.js.map