"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserPassword = void 0;
const common_1 = require("@nestjs/common");
const PasswordEncoder_1 = require("../../auth/util/PasswordEncoder");
const users_exception_1 = require("../../exceptionHandle/customException/users.exception");
const users_exception_message_1 = require("../../exceptionHandle/exceptionMessage/users.exception.message");
const validateUserPassword = async (originalPw, encodedPw) => {
    if (!(await (0, PasswordEncoder_1.isMatchPassword)(originalPw, encodedPw))) {
        throw new users_exception_1.UsersException(users_exception_message_1.UsersExcMsg.PASSWORD_IS_NOT_MATCH, common_1.HttpStatus.BAD_REQUEST);
    }
};
exports.validateUserPassword = validateUserPassword;
//# sourceMappingURL=users.validator.js.map