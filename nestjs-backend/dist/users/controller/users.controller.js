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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../service/users.service");
const signup_dto_1 = require("../dto/request/signup.dto");
const public_decorator_1 = require("../../auth/decorator/public.decorator");
const users_url_1 = require("./constant/users.url");
const users_controller_response_1 = require("./response/users.controller.response");
const update_password_dto_1 = require("../dto/request/update-password.dto");
const withdraw_dto_1 = require("../dto/request/withdraw.dto");
const users_controller_constant_1 = require("./constant/users.controller.constant");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async signup(signupDto) {
        await this.usersService.signup(signupDto);
        return users_controller_response_1.UsersResponse.SIGNUP_SUCCESS;
    }
    async updatePassword(updatePwDto, req) {
        await this.usersService.updatePassword(updatePwDto, req.user.userId);
        return users_controller_response_1.UsersResponse.UPDATE_PASSWORD_SUCCESS;
    }
    async withdraw(withdrawDto, req) {
        const id = req.user.userId;
        await this.usersService.withdraw(withdrawDto, id);
        return users_controller_response_1.UsersResponse.WITHDRAW_SUCCESS;
    }
    async getUserInfo(id) {
        const userInfo = await this.usersService.getOneDtoById(id);
        return userInfo;
    }
    async getProfile(req) {
        return await this.usersService.getOneDtoById(req.user.userId);
    }
    async getId(req) {
        return { id: req.user.userId };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(users_url_1.UsersUrl.SIGNUP),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signup", null);
__decorate([
    (0, common_1.Patch)(users_url_1.UsersUrl.UPDATE_PASSWORD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_password_dto_1.UpdatePwDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Delete)(users_url_1.UsersUrl.WITHDRAW),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [withdraw_dto_1.WithdrawDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "withdraw", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(users_url_1.UsersUrl.USER_INFO),
    __param(0, (0, common_1.Param)(users_controller_constant_1.UsersControllerConstant.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Get)(users_url_1.UsersUrl.PROFILE),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(users_url_1.UsersUrl.RETURN_ID),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getId", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)(users_url_1.UsersUrl.ROOT),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map