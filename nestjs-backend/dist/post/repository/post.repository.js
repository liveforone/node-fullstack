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
exports.PostRepository = void 0;
const common_1 = require("@nestjs/common");
const post_repository_constant_1 = require("./constant/post.repository.constant");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const post_exception_1 = require("../../exceptionHandle/customException/post.exception");
const post_exception_message_1 = require("../../exceptionHandle/exceptionMessage/post.exception.message");
const page_util_1 = require("../../common/page.util");
const prisma_no_offset_1 = require("prisma-no-offset");
const global_exception_message_1 = require("../../exceptionHandle/exceptionMessage/global.exception.message");
const validate_found_data_1 = require("../../common/validate.found-data");
let PostRepository = class PostRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(postEntity) {
        await this.prisma.post
            .create({
            data: postEntity,
        })
            .catch((err) => {
            if (err.code == global_exception_message_1.GlobalExcMsg.UNIQUE_CONSTRAINTS_CODE) {
                throw new common_1.HttpException(global_exception_message_1.GlobalExcMsg.IGNORE_UNIQUE_CONSTRAINTS, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    async updateContentByIdAndWriterId(content, id, writerId) {
        await this.prisma.post
            .update({
            data: { content: content, post_state: client_1.$Enums.PostState.EDITED },
            where: { id: id, writer_id: writerId },
        })
            .catch(() => {
            throw new post_exception_1.PostException(post_exception_message_1.PostExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
        });
    }
    async deleteOneByIdAndWriterId(id, writerId) {
        await this.prisma.post
            .delete({
            where: { id: id, writer_id: writerId },
        })
            .catch(() => {
            throw new post_exception_1.PostException(post_exception_message_1.PostExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
        });
    }
    async findOneById(id) {
        const post = await this.prisma.post.findUnique({
            where: { id: id },
        });
        (0, validate_found_data_1.validateFoundData)(post);
        return post;
    }
    async findAllOptimizedPostPage(lastId) {
        const lastIdCondition = (0, prisma_no_offset_1.ltLastIdCondition)(lastId);
        const posts = await this.prisma.post.findMany({
            where: lastIdCondition,
            select: { id: true, title: true, writer_id: true, created_date: true },
            orderBy: { id: 'desc' },
            take: post_repository_constant_1.PostRepoConstant.PAGE_SIZE,
        });
        return {
            postPages: posts,
            metadata: { lastId: (0, prisma_no_offset_1.findLastIdOrDefault)(posts) },
        };
    }
    async findOptimizedPostPageByWriterId(writerId, lastId) {
        const lastIdCondition = (0, prisma_no_offset_1.ltLastIdCondition)(lastId);
        const posts = await this.prisma.post.findMany({
            where: {
                AND: [{ writer_id: writerId }, lastIdCondition],
            },
            select: { id: true, title: true, writer_id: true, created_date: true },
            orderBy: { id: 'desc' },
            take: post_repository_constant_1.PostRepoConstant.PAGE_SIZE,
        });
        return {
            postPages: posts,
            metadata: { lastId: (0, prisma_no_offset_1.findLastIdOrDefault)(posts) },
        };
    }
    async searchOptimizedPostPageByTitle(title, lastId) {
        const lastIdCondition = (0, prisma_no_offset_1.ltLastIdCondition)(lastId);
        const posts = await this.prisma.post.findMany({
            where: { AND: [{ title: { startsWith: title } }, lastIdCondition] },
            select: { id: true, title: true, writer_id: true, created_date: true },
            orderBy: { id: 'desc' },
            take: post_repository_constant_1.PostRepoConstant.PAGE_SIZE,
        });
        return {
            postPages: posts,
            metadata: { lastId: (0, prisma_no_offset_1.findLastIdOrDefault)(posts) },
        };
    }
    async findAllPostPage(page) {
        page = (0, page_util_1.pageInitialize)(page);
        const posts = await this.prisma.post.findMany({
            select: { id: true, title: true, writer_id: true, created_date: true },
            orderBy: { id: 'desc' },
            take: post_repository_constant_1.PostRepoConstant.PAGE_SIZE,
            skip: (0, page_util_1.getOffset)(page, post_repository_constant_1.PostRepoConstant.PAGE_SIZE),
        });
        return {
            postPages: posts,
            metadata: { pageNumber: page },
        };
    }
    async findPostPageByWriterId(writerId, page) {
        page = (0, page_util_1.pageInitialize)(page);
        const posts = await this.prisma.post.findMany({
            where: { writer_id: writerId },
            select: { id: true, title: true, writer_id: true, created_date: true },
            orderBy: { id: 'desc' },
            take: post_repository_constant_1.PostRepoConstant.PAGE_SIZE,
            skip: (0, page_util_1.getOffset)(page, post_repository_constant_1.PostRepoConstant.PAGE_SIZE),
        });
        return {
            postPages: posts,
            metadata: { pageNumber: page },
        };
    }
    async searchPostPageByTitle(title, page) {
        page = (0, page_util_1.pageInitialize)(page);
        const posts = await this.prisma.post.findMany({
            where: { title: { startsWith: title } },
            select: { id: true, title: true, writer_id: true, created_date: true },
            orderBy: { id: 'desc' },
            take: post_repository_constant_1.PostRepoConstant.PAGE_SIZE,
            skip: (0, page_util_1.getOffset)(page, post_repository_constant_1.PostRepoConstant.PAGE_SIZE),
        });
        return {
            postPages: posts,
            metadata: { pageNumber: page },
        };
    }
};
exports.PostRepository = PostRepository;
exports.PostRepository = PostRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostRepository);
//# sourceMappingURL=post.repository.js.map