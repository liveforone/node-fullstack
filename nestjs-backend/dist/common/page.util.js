"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffset = exports.pageInitialize = exports.FIRST_PAGE = exports.PAGE = void 0;
exports.PAGE = 'page';
exports.FIRST_PAGE = 1;
function pageInitialize(page) {
    if (page == null || page <= 0) {
        page = exports.FIRST_PAGE;
    }
    return page;
}
exports.pageInitialize = pageInitialize;
function getOffset(page, pageSize) {
    return (page - 1) * pageSize;
}
exports.getOffset = getOffset;
//# sourceMappingURL=page.util.js.map