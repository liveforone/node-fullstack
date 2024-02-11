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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const users_repository_constant_1 = require("./constant/users.repository.constant");
const prisma_service_1 = require("../../prisma/prisma.service");
const validate_found_data_1 = require("../../common/validate.found-data");
const users_exception_1 = require("../../exceptionHandle/customException/users.exception");
const users_exception_message_1 = require("../../exceptionHandle/exceptionMessage/users.exception.message");
const global_exception_message_1 = require("../../exceptionHandle/exceptionMessage/global.exception.message");
let UsersRepository = class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(usersEntity) {
        await this.prisma.users.create({ data: usersEntity }).catch((err) => {
            let message;
            let status;
            if (err.code == global_exception_message_1.PrismaCommonErrCode.UNIQUE_CONSTRAINTS_VIOLATION) {
                message = users_exception_message_1.UsersExcMsg.USERNAME_UNIQUE_CONSTRAINTS_VIOLATION;
                status = common_1.HttpStatus.CONFLICT;
            }
            else {
                message = err.message;
                status = common_1.HttpStatus.BAD_REQUEST;
            }
            throw new common_1.HttpException(message, status);
        });
    }
    async updatePasswordById(newPassword, id) {
        await this.prisma.users
            .update({
            data: { password: newPassword },
            where: { id: id },
        })
            .catch((err) => {
            let message;
            let status;
            if (err.code === global_exception_message_1.PrismaCommonErrCode.RECORD_NOT_FOUND) {
                message = users_exception_message_1.UsersExcMsg.USERS_ID_BAD_REQUEST;
                status = common_1.HttpStatus.BAD_REQUEST;
            }
            else {
                message = err.message;
                status = common_1.HttpStatus.BAD_REQUEST;
            }
            throw new users_exception_1.UsersException(message, status);
        });
    }
    async addRefreshToken(username, refreshToken) {
        await this.prisma.users.updateMany({
            data: { refresh_token: refreshToken },
            where: { username: username },
        });
    }
    async reissueRefreshToken(reissuedRefreshToken, id) {
        await this.prisma.users.updateMany({
            data: { refresh_token: reissuedRefreshToken },
            where: { id: id },
        });
    }
    async removeRefreshToken(id) {
        await this.prisma.users.updateMany({
            data: { refresh_token: users_repository_constant_1.UsersRepoConstant.EMPTY_STRING },
            where: { id: id },
        });
    }
    async deleteOneById(id) {
        await this.prisma.users
            .delete({
            where: { id: id },
        })
            .catch((err) => {
            let message;
            let status;
            if (err.code === global_exception_message_1.PrismaCommonErrCode.RECORD_NOT_FOUND) {
                message = users_exception_message_1.UsersExcMsg.USERS_ID_BAD_REQUEST;
                status = common_1.HttpStatus.BAD_REQUEST;
            }
            else {
                message = err.message;
                status = common_1.HttpStatus.BAD_REQUEST;
            }
            throw new users_exception_1.UsersException(message, status);
        });
    }
    async findOneByUsername(username) {
        const user = await this.prisma.users.findUnique({
            where: { username: username },
        });
        (0, validate_found_data_1.validateFoundData)(user);
        return user;
    }
    async findOneById(id) {
        const user = await this.prisma.users.findUnique({
            where: { id: id },
        });
        (0, validate_found_data_1.validateFoundData)(user);
        return user;
    }
    async findOneUserInfoById(id) {
        const userInfo = await this.prisma.users.findUnique({
            select: { id: true, username: true, role: true },
            where: { id: id },
        });
        (0, validate_found_data_1.validateFoundData)(userInfo);
        return userInfo;
    }
    async findRefreshTokenById(id) {
        const refreshToken = await this.prisma.users.findUnique({
            select: { refresh_token: true },
            where: { id: id },
        });
        (0, validate_found_data_1.validateFoundData)(refreshToken);
        return refreshToken;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map