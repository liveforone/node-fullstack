"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersException = void 0;
const common_1 = require("@nestjs/common");
class UsersException extends common_1.HttpException {
    constructor(usersExcMsg, httpStatus) {
        super(usersExcMsg, httpStatus);
    }
}
exports.UsersException = UsersException;
//# sourceMappingURL=users.exception.js.map