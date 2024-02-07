"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostException = void 0;
const common_1 = require("@nestjs/common");
class PostException extends common_1.HttpException {
    constructor(postExcMsg, httpStatus) {
        super(postExcMsg, httpStatus);
    }
}
exports.PostException = PostException;
//# sourceMappingURL=post.exception.js.map