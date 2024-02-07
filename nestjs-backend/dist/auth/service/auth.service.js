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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const env_path_constant_1 = require("../../config/env_path.constant");
const users_service_1 = require("../../users/service/users.service");
const auth_exception_message_1 = require("../../exceptionHandle/exceptionMessage/auth.exception.message");
const auth_service_log_1 = require("../log/auth.service.log");
const token_info_dto_1 = require("../dto/response/token-info.dto");
const users_validator_1 = require("../../users/validator/users.validator");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signIn(loginDto) {
        const { username, password } = loginDto;
        const user = await this.usersService.getOneByUsername(username);
        await (0, users_validator_1.validateUserPassword)(password, user.password);
        const refreshToken = await this.generateRefreshToken();
        await this.usersService.saveRefreshToken(username, refreshToken);
        const id = user.id;
        this.logger.log(auth_service_log_1.AuthServiceLog.SIGNIN_SUCCESS + username);
        return new token_info_dto_1.TokenInfo(await this.generateAccessToken(id), refreshToken);
    }
    async reissueJwtToken(id, refreshToken) {
        const foundRefreshToken = await this.usersService.getRefreshTokenById(id);
        if (foundRefreshToken.refresh_token != refreshToken) {
            throw new common_1.UnauthorizedException(auth_exception_message_1.AuthExcMsg.REFRESH_TOKEN_IS_NOT_MATCH);
        }
        try {
            await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get(env_path_constant_1.EnvPath.SECRET_KEY),
            });
        }
        catch (err) {
            throw new common_1.UnauthorizedException(auth_exception_message_1.AuthExcMsg.REFRESH_TOKEN_IS_EXPIRE);
        }
        const reissuedRefreshToken = await this.generateRefreshToken();
        await this.usersService.reissueRefreshToken(reissuedRefreshToken, id);
        this.logger.log(auth_service_log_1.AuthServiceLog.REISSUE_TOKEN_SUCCESS + id);
        return new token_info_dto_1.TokenInfo(await this.generateAccessToken(id), reissuedRefreshToken);
    }
    createPayload(id) {
        return { sub: id };
    }
    async generateAccessToken(id) {
        return await this.jwtService.signAsync(this.createPayload(id));
    }
    async generateRefreshToken() {
        return await this.jwtService.signAsync({}, {
            secret: this.configService.get(env_path_constant_1.EnvPath.SECRET_KEY),
            expiresIn: this.configService.get(env_path_constant_1.EnvPath.REFRESH_TOKEN_EXPIRATION_TIME),
        });
    }
    async logout(id) {
        await this.usersService.removeRefreshToken(id);
        this.logger.log(auth_service_log_1.AuthServiceLog.LOGOUT_SUCCESS + id);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map