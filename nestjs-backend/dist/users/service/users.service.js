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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_entity_1 = require("../entities/users.entity");
const users_service_log_1 = require("../log/users.service.log");
const users_repository_1 = require("../repository/users.repository");
const PasswordEncoder_1 = require("../../auth/util/PasswordEncoder");
const users_validator_1 = require("../validator/users.validator");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async signup(signupDto) {
        const { username, password } = signupDto;
        const user = await users_entity_1.UsersEntity.create(username, password);
        await this.usersRepository.save(user);
        this.logger.log(users_service_log_1.UsersServiceLog.SIGNUP_SUCCESS + username);
    }
    async updatePassword(updatePwDto, id) {
        const { originalPw, newPw } = updatePwDto;
        const user = await this.usersRepository.findOneById(id);
        await (0, users_validator_1.validateUserPassword)(originalPw, user.password);
        await this.usersRepository.updatePasswordById(await (0, PasswordEncoder_1.encodePassword)(newPw), id);
        this.logger.log(users_service_log_1.UsersServiceLog.UPDATE_PW_SUCCESS + id);
    }
    async saveRefreshToken(username, refreshToken) {
        await this.usersRepository.addRefreshToken(username, refreshToken);
    }
    async reissueRefreshToken(reissuedRefreshToken, id) {
        await this.usersRepository.reissueRefreshToken(reissuedRefreshToken, id);
    }
    async removeRefreshToken(id) {
        await this.usersRepository.removeRefreshToken(id);
        this.logger.log(users_service_log_1.UsersServiceLog.REMOVE_REFRESH_TOKEN_SUCCESS + id);
    }
    async withdraw(withdrawDto, id) {
        const user = await this.usersRepository.findOneById(id);
        await (0, users_validator_1.validateUserPassword)(withdrawDto.password, user.password);
        await this.usersRepository.deleteOneById(id);
        this.logger.log(users_service_log_1.UsersServiceLog.WITHDRAW_SUCCESS + id);
    }
    async getOneByUsername(username) {
        return await this.usersRepository.findOneByUsername(username);
    }
    async getOneById(id) {
        return await this.usersRepository.findOneById(id);
    }
    async getOneDtoById(id) {
        return await this.usersRepository.findOneUserInfoById(id);
    }
    async getRefreshTokenById(id) {
        return await this.usersRepository.findRefreshTokenById(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map