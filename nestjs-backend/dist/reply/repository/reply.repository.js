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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const global_exception_message_1 = require("../../exceptionHandle/exceptionMessage/global.exception.message");
const client_1 = require("@prisma/client");
const reply_exception_1 = require("../../exceptionHandle/customException/reply.exception");
const reply_exception_message_1 = require("../../exceptionHandle/exceptionMessage/reply.exception.message");
const validate_found_data_1 = require("../../common/validate.found-data");
const prisma_no_offset_1 = require("prisma-no-offset");
const reply_repository_constant_1 = require("./constant/reply.repository.constant");
let ReplyRepository = class ReplyRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(reply) {
        await this.prisma.reply.create({ data: reply }).catch((err) => {
            if (err.code == global_exception_message_1.GlobalExcMsg.UNIQUE_CONSTRAINTS_CODE) {
                throw new common_1.HttpException(global_exception_message_1.GlobalExcMsg.IGNORE_UNIQUE_CONSTRAINTS, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    async updateReplyByIdAndWriterId(content, id, writer_id) {
        await this.prisma.reply
            .update({
            data: { content: content, reply_state: client_1.$Enums.ReplyState.EDITED },
            where: { id: id, writer_id: writer_id },
        })
            .catch(() => {
            throw new reply_exception_1.ReplyException(reply_exception_message_1.ReplyExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
        });
    }
    async deleteOneByIdAndWriterId(id, writer_id) {
        await this.prisma.reply
            .delete({
            where: { id: id, writer_id: writer_id },
        })
            .catch(() => {
            throw new reply_exception_1.ReplyException(reply_exception_message_1.ReplyExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
        });
    }
    async findOneById(id) {
        const reply = await this.prisma.reply.findUnique({
            where: { id: id },
        });
        (0, validate_found_data_1.validateFoundData)(reply);
        return reply;
    }
    async findReplyPageByPostId(post_id, lastId) {
        const lastIdCondition = (0, prisma_no_offset_1.ltLastIdCondition)(lastId);
        const replies = await this.prisma.reply.findMany({
            where: {
                AND: [{ post_id: post_id }, lastIdCondition],
            },
            orderBy: { id: 'desc' },
            take: reply_repository_constant_1.ReplyRepoConstant.PAGE_SIZE,
        });
        return {
            replyPages: replies,
            metadata: { lastId: (0, prisma_no_offset_1.findLastIdOrDefault)(replies) },
        };
    }
};
exports.ReplyRepository = ReplyRepository;
exports.ReplyRepository = ReplyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReplyRepository);
//# sourceMappingURL=reply.repository.js.map