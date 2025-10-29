"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSession = exports.authenticateJWT = void 0;
const jwt_services_1 = require("../services/jwt.services");
const response_controller_1 = __importDefault(require("../controllers/response.controller"));
const enums_1 = require("../types/enums");
const authenticateJWT = (req, res, next) => {
    const accessToken = req.cookies[enums_1.ECookie.ACCESS_TOKEN];
    if (accessToken === null) {
        (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.UNAUTHORIZED, { message: 'Token requerido', exito: false });
        return;
    }
    req.session = { user: null };
    try {
        req.session.user = jwt_services_1.jwtService.verifyToken(accessToken);
        next();
    }
    catch (err) {
        (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.UNAUTHORIZED, { message: 'Token inválido o expirado', exito: false });
    }
};
exports.authenticateJWT = authenticateJWT;
const getUserSession = (req) => {
    return req.session.user;
};
exports.getUserSession = getUserSession;
