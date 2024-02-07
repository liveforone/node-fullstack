"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyException = void 0;
const common_1 = require("@nestjs/common");
class ReplyException extends common_1.HttpException {
    constructor(replyExcMsg, httpStatus) {
        super(replyExcMsg, httpStatus);
    }
}
exports.ReplyException = ReplyException;
//# sourceMappingURL=reply.exception.js.map