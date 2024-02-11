"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFoundData = void 0;
const common_1 = require("@nestjs/common");
const validateFoundData = (foundData) => {
    if (!foundData) {
        throw new common_1.HttpException('데이터가 존재하지 않습니다.', common_1.HttpStatus.NOT_FOUND);
    }
};
exports.validateFoundData = validateFoundData;
//# sourceMappingURL=validate.found-data.js.map