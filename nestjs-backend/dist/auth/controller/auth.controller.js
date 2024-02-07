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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_url_1 = require("./constant/auth.url");
const auth_service_1 = require("../service/auth.service");
const public_decorator_1 = require("../decorator/public.decorator");
const login_dto_1 = require("../dto/request/login.dto");
const auth_controller_constant_1 = require("./constant/auth.controller.constant");
const auth_controller_response_1 = require("./response/auth.controller.response");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginRequest) {
        const tokenInfo = await this.authService.signIn(loginRequest);
        return tokenInfo;
    }
    async reissueJwtToken(req, idObj) {
        const tokenInfo = await this.authService.reissueJwtToken(idObj.id, req.headers[auth_controller_constant_1.AuthControllerConstant.REFRESH_TOKEN_HEADER]);
        return tokenInfo;
    }
    async logout(req) {
        await this.authService.logout(req.user.userId);
        return auth_controller_response_1.AuthResponse.LOGOUT_SUCCESS;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(auth_url_1.AuthUrl.LOGIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(auth_url_1.AuthUrl.REISSUE),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reissueJwtToken", null);
__decorate([
    (0, common_1.Post)(auth_url_1.AuthUrl.LOGOUT),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(auth_url_1.AuthUrl.ROOT),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map