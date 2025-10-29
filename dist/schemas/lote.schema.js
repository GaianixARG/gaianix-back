"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoteSchema = exports.loteSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const campo_schema_1 = require("./campo.schema");
exports.loteSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    codigo: zod_1.default.string(),
    campo: campo_schema_1.campoSchema
});
exports.createLoteSchema = exports.loteSchema.omit({ id: true });
