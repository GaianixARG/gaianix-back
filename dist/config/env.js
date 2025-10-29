"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnv = (key, fallback) => {
    const value = process.env[key] ?? fallback;
    if (value == null) {
        throw new Error(`❌ Missing env variable: ${key}`);
    }
    return value;
};
exports.config = {
    port: Number(getEnv('PORT', '3000')),
    nodeEnv: getEnv('NODE_ENV', 'development'),
    jwtSecret: getEnv('JWT_SECRET'),
    databaseUrl: getEnv('DATABASE_URL'),
    projectUrlSupabase: getEnv('PROJECT_URL_SUPABASE', ''),
    apyKeySupabase: getEnv('APY_KEY_SUPABASE', '')
};
