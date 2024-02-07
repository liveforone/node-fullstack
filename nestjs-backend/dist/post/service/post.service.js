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
var PostService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const post_repository_1 = require("../repository/post.repository");
const post_entity_1 = require("../entities/post.entity");
const post_service_log_1 = require("../log/post.service.log");
let PostService = PostService_1 = class PostService {
    constructor(postRepository) {
        this.postRepository = postRepository;
        this.logger = new common_1.Logger(PostService_1.name);
    }
    async createPost(createPostDto) {
        const { writerId: writerId, title, content } = createPostDto;
        await this.postRepository.save(post_entity_1.PostEntity.create(title, content, writerId));
        this.logger.log(post_service_log_1.PostServiceLog.CREATE_POST_SUCCESS + writerId);
    }
    async updateContent(updatePostDto, id) {
        const { writerId, content } = updatePostDto;
        await this.postRepository.updateContentByIdAndWriterId(content, id, writerId);
        this.logger.log(post_service_log_1.PostServiceLog.UPDATE_POST_SUCCESS + id);
    }
    async removePost(removePostDto, id) {
        await this.postRepository.deleteOneByIdAndWriterId(id, removePostDto.writerId);
        this.logger.log(post_service_log_1.PostServiceLog.REMOVE_POST_SUCCESS + id);
    }
    async getPostById(id) {
        return await this.postRepository.findOneById(id);
    }
    async getAllOptimizedPostPage(lastId) {
        return await this.postRepository.findAllOptimizedPostPage(lastId);
    }
    async getOptimizedPostPageByWriterId(writerId, lastId) {
        return await this.postRepository.findOptimizedPostPageByWriterId(writerId, lastId);
    }
    async searchOptimizedPostPageByTitle(title, lastId) {
        return await this.postRepository.searchOptimizedPostPageByTitle(title, lastId);
    }
    async getAllPostPage(page) {
        return await this.postRepository.findAllPostPage(page);
    }
    async getPostPageByWriterId(writerId, page) {
        return await this.postRepository.findPostPageByWriterId(writerId, page);
    }
    async searchPostPageByTitle(title, page) {
        return await this.postRepository.searchPostPageByTitle(title, page);
    }
};
exports.PostService = PostService;
exports.PostService = PostService = PostService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [post_repository_1.PostRepository])
], PostService);
//# sourceMappingURL=post.service.js.map