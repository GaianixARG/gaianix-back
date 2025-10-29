"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = exports.userPrivateSchema = exports.loginSchema = exports.userSchema = exports.roleSchema = void 0;
const zod_1 = require("zod");
exports.roleSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    name: zod_1.z.string()
});
exports.userSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    name: zod_1.z.string(),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    role: exports.roleSchema
});
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string()
});
exports.userPrivateSchema = exports.userSchema.omit({ password: true });
exports.createUserSchema = exports.userSchema.omit({ id: true });
