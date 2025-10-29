"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const order_schema_1 = require("../schemas/order.schema");
const seed_schema_1 = require("../schemas/seed.schema");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gaianix API',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:${env_1.config.port}/api`,
                description: 'Servidor local'
            }
        ],
        components: {
            schemas: {
                ...order_schema_1.SwaggerSchemasOrder,
                ...seed_schema_1.SwaggerSchemasSeed
            }
        }
    },
    apis: ['./src/routes/*.ts']
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.setupSwagger = setupSwagger;
