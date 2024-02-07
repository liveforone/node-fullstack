"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyController = void 0;
const common_1 = require("@nestjs/common");
const reply_service_1 = require("../service/reply.service");
const reply_url_1 = require("./constant/reply.url");
const create_reply_dto_1 = require("../dto/request/create-reply.dto");
const reply_controller_response_1 = require("./response/reply.controller.response");
const update_reply_dto_1 = require("../dto/request/update-reply.dto");
const reply_controller_constant_1 = require("./constant/reply.controller.constant");
const remove_reply_dto_1 = require("../dto/request/remove-reply.dto");
const prisma_no_offset_1 = require("prisma-no-offset");
let ReplyController = class ReplyController {
    constructor(replyService) {
        this.replyService = replyService;
    }
    async detail(id) {
        return await this.replyService.getOneById(id);
    }
    async belongPost(postId, lastId = prisma_no_offset_1.DEFAULT_LAST_ID) {
        return await this.replyService.getReplyPageByPostId(postId, lastId);
    }
    async createReply(createReplyDto) {
        await this.replyService.createReply(createReplyDto);
        return reply_controller_response_1.ReplyResponse.CREATE_REPLY_SUCCESS;
    }
    async updateReply(updateReplyDto, id) {
        await this.replyService.updateReply(updateReplyDto, id);
        return reply_controller_response_1.ReplyResponse.UPDATE_REPLY_SUCCESS;
    }
    async removeReply(removeReplyDto, id) {
        await this.replyService.removeReply(removeReplyDto, id);
        return reply_controller_response_1.ReplyResponse.REMOVE_REPLY_SUCCESS;
    }
};
exports.ReplyController = ReplyController;
__decorate([
    (0, common_1.Get)(reply_url_1.ReplyUrl.DETAIL),
    __param(0, (0, common_1.Param)(reply_controller_constant_1.ReplyControllerConstant.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "detail", null);
__decorate([
    (0, common_1.Get)(reply_url_1.ReplyUrl.BELONG_POST),
    __param(0, (0, common_1.Param)(reply_controller_constant_1.ReplyControllerConstant.POST_ID)),
    __param(1, (0, common_1.Query)(prisma_no_offset_1.LAST_ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt, BigInt]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "belongPost", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reply_dto_1.CreateReplyDto]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "createReply", null);
__decorate([
    (0, common_1.Patch)(reply_url_1.ReplyUrl.UPDATE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)(reply_controller_constant_1.ReplyControllerConstant.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_reply_dto_1.UpdateReplydto, BigInt]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "updateReply", null);
__decorate([
    (0, common_1.Delete)(reply_url_1.ReplyUrl.REMOVE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)(reply_controller_constant_1.ReplyControllerConstant.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [remove_reply_dto_1.RemoveReplyDto, BigInt]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "removeReply", null);
exports.ReplyController = ReplyController = __decorate([
    (0, common_1.Controller)(reply_url_1.ReplyUrl.ROOT),
    __metadata("design:paramtypes", [reply_service_1.ReplyService])
], ReplyController);
//# sourceMappingURL=reply.controller.js.map