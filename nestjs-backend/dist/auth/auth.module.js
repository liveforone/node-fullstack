"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./service/auth.service");
const auth_controller_1 = require("./controller/auth.controller");
const users_module_1 = require("../users/users.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const env_path_constant_1 = require("../config/env_path.constant");
const JwtStrategy_1 = require("./strategy/JwtStrategy");
const passport_1 = require("@nestjs/passport");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get(env_path_constant_1.EnvPath.SECRET_KEY),
                    signOptions: {
                        expiresIn: configService.get(env_path_constant_1.EnvPath.ACCESS_TOKEN_EXIPIRATION_TIME),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [auth_service_1.AuthService, JwtStrategy_1.JwtStratey],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map