"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidatedBody = exports.validateBody = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
const response_controller_1 = __importDefault(require("../controllers/response.controller"));
const validateBody = (schema) => (req, res, next) => {
    try {
        req.validatedBody = schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.issues.map((issue) => issue.path.join('.') + ' ' + issue.message);
            (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { message: `Datos incorrectos en ${errorMessages.join(' - ')}`, exito: false });
        }
        else {
            (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.INTERNAL_SERVER_ERROR, { message: 'Internal Server Error', exito: false });
        }
    }
};
exports.validateBody = validateBody;
const getValidatedBody = (req) => {
    return req.validatedBody;
};
exports.getValidatedBody = getValidatedBody;
