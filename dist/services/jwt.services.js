"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const cookie_1 = require("../config/cookie");
exports.jwtService = {
    generateToken: (payload, typeToken) => {
        if (payload == null || env_1.config.jwtSecret === '')
            return '';
        const options = { expiresIn: cookie_1.TokenPerExpiresIn[typeToken] };
        return jsonwebtoken_1.default.sign(payload, env_1.config.jwtSecret, options);
    },
    verifyToken: (token) => {
        return jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
    }
};
