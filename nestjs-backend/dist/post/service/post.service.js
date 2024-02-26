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
var PostService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const post_repository_1 = require("../repository/post.repository");
const post_entity_1 = require("../entities/post.entity");
const post_service_log_1 = require("../log/post.service.log");
const post_cache_key_1 = require("../../redis/key/post.cache.key");
const redis_constant_1 = require("../../redis/constant/redis.constant");
const redis_util_1 = require("../../redis/util/redis.util");
let PostService = PostService_1 = class PostService {
    constructor(redis, postRepository) {
        this.redis = redis;
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
        await this.redis.del(post_cache_key_1.PostCacheKey.DETAIL + id);
        this.logger.log(post_service_log_1.PostServiceLog.UPDATE_POST_SUCCESS + id);
    }
    async removePost(removePostDto, id) {
        await this.postRepository.deleteOneByIdAndWriterId(id, removePostDto.writerId);
        await this.redis.del(post_cache_key_1.PostCacheKey.DETAIL + id);
        this.logger.log(post_service_log_1.PostServiceLog.REMOVE_POST_SUCCESS + id);
    }
    async getPostById(id) {
        const redisKey = post_cache_key_1.PostCacheKey.DETAIL + id;
        const cachedPostInfo = await this.redis.get(redisKey);
        if ((0, redis_util_1.notExistInRedis)(cachedPostInfo)) {
            const postInfo = await this.postRepository.findOneById(id);
            await this.redis.set(redisKey, JSON.stringify(postInfo));
            await this.redis.expire(redisKey, redis_constant_1.REDIS_GLOBAL_TTL);
            return postInfo;
        }
        else {
            return JSON.parse(cachedPostInfo);
        }
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
    __param(0, (0, common_1.Inject)(redis_constant_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [Object, post_repository_1.PostRepository])
], PostService);
//# sourceMappingURL=post.service.js.map