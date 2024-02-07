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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("../service/post.service");
const post_url_1 = require("./constant/post.url");
const post_controller_constant_1 = require("./constant/post.controller.constant");
const create_post_dto_1 = require("../dto/request/create-post.dto");
const update_post_dto_1 = require("../dto/request/update-post.dto");
const remove_post_dto_1 = require("../dto/request/remove-post.dto");
const post_controller_response_1 = require("./response/post.controller.response");
const prisma_no_offset_1 = require("prisma-no-offset");
const page_util_1 = require("../../common/page.util");
const cache_manager_1 = require("@nestjs/cache-manager");
const post_cache_key_1 = require("../../cache/key/post.cache.key");
let PostController = class PostController {
    constructor(postService, cacheManger) {
        this.postService = postService;
        this.cacheManger = cacheManger;
    }
    async allPosts(lastId = prisma_no_offset_1.DEFAULT_LAST_ID) {
        return this.postService.getAllOptimizedPostPage(lastId);
    }
    async belongWriter(writerId, lastId = prisma_no_offset_1.DEFAULT_LAST_ID) {
        return await this.postService.getOptimizedPostPageByWriterId(writerId, lastId);
    }
    async searchPosts(keyword, lastId = prisma_no_offset_1.DEFAULT_LAST_ID) {
        return await this.postService.searchOptimizedPostPageByTitle(keyword, lastId);
    }
    async allPostsOffset(page = page_util_1.FIRST_PAGE) {
        return await this.postService.getAllPostPage(page);
    }
    async belongWriterOffset(writerId, page = page_util_1.FIRST_PAGE) {
        return await this.postService.getPostPageByWriterId(writerId, page);
    }
    async searchPostsOffset(keyword, page = page_util_1.FIRST_PAGE) {
        return await this.postService.searchPostPageByTitle(keyword, page);
    }
    async detail(id) {
        return await this.postService.getPostById(id);
    }
    async createPost(createPostDto) {
        await this.postService.createPost(createPostDto);
        return post_controller_response_1.PostResponse.CREATE_POST_SUCCESS;
    }
    async updatePost(id, updatePostDto) {
        await this.postService.updateContent(updatePostDto, id);
        await this.cacheManger.del(post_cache_key_1.PostCacheKey.DETAIL + id);
        return post_controller_response_1.PostResponse.UPDATE_POST_SUCCESS;
    }
    async removePost(id, removePostDto) {
        await this.postService.removePost(removePostDto, id);
        await this.cacheManger.del(post_cache_key_1.PostCacheKey.DETAIL + id);
        return post_controller_response_1.PostResponse.DELETE_POST_SUCCESS;
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(prisma_no_offset_1.LAST_ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "allPosts", null);
__decorate([
    (0, common_1.Get)(post_url_1.PostUrl.BELONG_WRITER),
    __param(0, (0, common_1.Param)(post_controller_constant_1.PostControllerConstant.WRITER_ID)),
    __param(1, (0, common_1.Query)(prisma_no_offset_1.LAST_ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, BigInt]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "belongWriter", null);
__decorate([
    (0, common_1.Get)(post_url_1.PostUrl.SEARCH_POSTS),
    __param(0, (0, common_1.Query)(post_controller_constant_1.PostControllerConstant.KEYWORD)),
    __param(1, (0, common_1.Query)(prisma_no_offset_1.LAST_ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, BigInt]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "searchPosts", null);
__decorate([
    (0, common_1.Get)(post_url_1.PostUrl.ALL_OFFSET),
    __param(0, (0, common_1.Query)(page_util_1.PAGE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "allPostsOffset", null);
__decorate([
    (0, common_1.Get)(post_url_1.PostUrl.BELONG_WRITER_OFFSET),
    __param(0, (0, common_1.Param)(post_controller_constant_1.PostControllerConstant.WRITER_ID)),
    __param(1, (0, common_1.Query)(page_util_1.PAGE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "belongWriterOffset", null);
__decorate([
    (0, common_1.Get)(post_url_1.PostUrl.SEARCH_POSTS_OFFSET),
    __param(0, (0, common_1.Query)(post_controller_constant_1.PostControllerConstant.KEYWORD)),
    __param(1, (0, common_1.Query)(page_util_1.PAGE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "searchPostsOffset", null);
__decorate([
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    (0, common_1.Get)(post_url_1.PostUrl.DETAIL),
    __param(0, (0, common_1.Param)(post_controller_constant_1.PostControllerConstant.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
__decorate([
    (0, common_1.Patch)(post_url_1.PostUrl.UPDATE),
    __param(0, (0, common_1.Param)(post_controller_constant_1.PostControllerConstant.ID)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)(post_url_1.PostUrl.REMOVE),
    __param(0, (0, common_1.Param)(post_controller_constant_1.PostControllerConstant.ID)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt, remove_post_dto_1.RemovePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "removePost", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)(post_url_1.PostUrl.ROOT),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [post_service_1.PostService,
        cache_manager_1.Cache])
], PostController);
//# sourceMappingURL=post.controller.js.map