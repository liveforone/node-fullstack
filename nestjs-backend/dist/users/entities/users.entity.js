"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersEntity = void 0;
const PasswordEncoder_1 = require("../../auth/util/PasswordEncoder");
const users_constant_1 = require("./constant/users.constant");
const client_1 = require("@prisma/client");
class UsersEntity {
    static async create(username, password) {
        const user = new UsersEntity();
        user.username = username;
        user.password = await (0, PasswordEncoder_1.encodePassword)(password);
        user.role =
            username == users_constant_1.UsersConstant.ADMIN_USERNAME
                ? client_1.$Enums.Role.ADMIN
                : client_1.$Enums.Role.MEMBER;
        return user;
    }
}
exports.UsersEntity = UsersEntity;
//# sourceMappingURL=users.entity.js.map