"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFoundData = void 0;
const common_1 = require("@nestjs/common");
const global_exception_message_1 = require("../exceptionHandle/exceptionMessage/global.exception.message");
const validateFoundData = (foundData) => {
    if (!foundData) {
        throw new common_1.HttpException(global_exception_message_1.GlobalExcMsg.DATA_IS_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
};
exports.validateFoundData = validateFoundData;
//# sourceMappingURL=validate.found-data.js.map