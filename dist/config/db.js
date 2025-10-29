"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const env_1 = require("./env");
pg_1.default.types.setTypeParser(pg_1.default.types.builtins.NUMERIC, (value) => {
    return parseFloat(value);
});
const pool = new pg_1.default.Pool({
    connectionString: env_1.config.databaseUrl,
    ssl: env_1.config.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined
});
exports.default = pool;
