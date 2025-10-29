"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_services_1 = require("../services/jwt.services");
const response_controller_1 = __importStar(require("./response.controller"));
const enums_1 = require("../types/enums");
const validateBody_1 = require("../middlewares/validateBody");
const cookie_1 = require("../config/cookie");
const auth_1 = require("../middlewares/auth");
class UserController {
    constructor(models) {
        this.login = async (req, res) => {
            const { username, password } = (0, validateBody_1.getValidatedBody)(req);
            try {
                const user = await this.models.userModel.getByUsernameForLogin(username);
                if (user == null)
                    throw new Error('Credenciales inválidas');
                const isValid = bcrypt_1.default.compareSync(password, user.password);
                if (!isValid)
                    throw new Error('Credenciales inválidas');
                const { password: passwordRest, ...restOfUser } = user;
                const accessToken = jwt_services_1.jwtService.generateToken({ id: user.id, username: user.username, role: user.role }, enums_1.ECookie.ACCESS_TOKEN);
                // const refresh_token = jwtService.generateToken({ id: user.id, username: user.username, role: user.role }, ECookie.REFRESH_TOKEN)
                res
                    .cookie(enums_1.ECookie.ACCESS_TOKEN, accessToken, (0, cookie_1.getConfigCookie)(enums_1.ECookie.ACCESS_TOKEN))
                    // .cookie(ECookie.REFRESH_TOKEN, refresh_token, getConfigCookie(ECookie.REFRESH_TOKEN))
                    .send({ exito: true, data: { accessToken, user: restOfUser } });
            }
            catch (error) {
                console.log(error);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.UNAUTHORIZED, { message: 'Credenciales inválidas', exito: false });
            }
        };
        this.logout = (_req, res) => {
            res.clearCookie(enums_1.ECookie.ACCESS_TOKEN).send({ message: 'Logout exitoso (borrar token en cliente) }', exito: true });
        };
        this.create = async (req, res) => {
            const body = (0, validateBody_1.getValidatedBody)(req);
            const userExistente = await this.models.userModel.getByUsername(body.username);
            if (userExistente != null) {
                (0, response_controller_1.sendData)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Ya existe un usuario con el mismo nombre' });
                return;
            }
            const newUser = await this.models.userModel.create(body);
            (0, response_controller_1.sendData)(res, enums_1.EHttpStatusCode.OK_CREATED, {
                exito: true,
                data: newUser
            });
        };
        this.me = async (req, res) => {
            const session = (0, auth_1.getUserSession)(req);
            const user = await this.models.userModel.getById(session.id);
            (0, response_controller_1.sendData)(res, enums_1.EHttpStatusCode.OK, {
                exito: true,
                data: user
            });
        };
        this.models = models;
    }
}
exports.UserController = UserController;
