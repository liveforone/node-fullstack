"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatchPassword = exports.encodePassword = void 0;
const bcrypt = require("bcrypt");
const encodePassword = async (password) => {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
};
exports.encodePassword = encodePassword;
const isMatchPassword = async (password, encodePassword) => {
    return await bcrypt.compare(password, encodePassword);
};
exports.isMatchPassword = isMatchPassword;
//# sourceMappingURL=PasswordEncoder.js.map