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
var ReplyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyService = void 0;
const common_1 = require("@nestjs/common");
const reply_repository_1 = require("../repository/reply.repository");
const reply_entity_1 = require("../entities/reply.entity");
const reply_service_log_1 = require("../log/reply.service.log");
let ReplyService = ReplyService_1 = class ReplyService {
    constructor(replyRepository) {
        this.replyRepository = replyRepository;
        this.logger = new common_1.Logger(ReplyService_1.name);
    }
    async createReply(createReplyDto) {
        const { writerId: writer_id, postId: post_id, content } = createReplyDto;
        const reply = reply_entity_1.ReplyEntity.create(writer_id, post_id, content);
        await this.replyRepository.save(reply);
        this.logger.log(reply_service_log_1.ReplyServiceLog.CREATE_REPLY_SUCCESS + writer_id);
    }
    async updateReply(updateReplyDto, id) {
        const { content, writerId: writer_id } = updateReplyDto;
        await this.replyRepository.updateReplyByIdAndWriterId(content, id, writer_id);
        this.logger.log(reply_service_log_1.ReplyServiceLog.UPDATE_REPLY_SUCCESS + id);
    }
    async removeReply(removeReplyDto, id) {
        const { writerId: writer_id } = removeReplyDto;
        await this.replyRepository.deleteOneByIdAndWriterId(id, writer_id);
        this.logger.log(reply_service_log_1.ReplyServiceLog.REMOVE_REPLY_SUCCESS + id);
    }
    async getOneById(id) {
        return await this.replyRepository.findOneById(id);
    }
    async getReplyPageByPostId(post_id, lastId) {
        return await this.replyRepository.findReplyPageByPostId(post_id, lastId);
    }
};
exports.ReplyService = ReplyService;
exports.ReplyService = ReplyService = ReplyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reply_repository_1.ReplyRepository])
], ReplyService);
//# sourceMappingURL=reply.service.js.map