"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const HttpExceptionFilter_1 = require("./exceptionHandle/exceptionFilter/HttpExceptionFilter");
const timeout_interceptor_1 = require("./interceptor/timeout.interceptor");
const jwt_guard_1 = require("./auth/guard/jwt.guard");
const post_module_1 = require("./post/post.module");
const prisma_module_1 = require("./prisma/prisma.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const reply_module_1 = require("./reply/reply.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                cache: true,
                isGlobal: true,
            }),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                store: cache_manager_redis_yet_1.redisStore,
                ttl: 3600000,
            }),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            post_module_1.PostModule,
            reply_module_1.ReplyModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_guard_1.JwtGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: HttpExceptionFilter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: timeout_interceptor_1.TimeoutInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map