"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const orders_routes_1 = require("./routes/orders.routes");
const seeds_routes_1 = require("./routes/seeds.routes");
const users_routes_1 = require("./routes/users.routes");
const lotes_routes_1 = require("./routes/lotes.routes");
const swagger_1 = require("./config/swagger");
const fertilizer_routes_1 = require("./routes/fertilizer.routes");
const env_1 = require("./config/env");
const createApp = ({ orderModel, userModel, seedModel, loteModel, fertilizerModel }) => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: '*',
        credentials: true
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get('/', (_, res) => res.send('GAIANIX BACK, /api/docs to view SWAGGER'));
    app.use('/api/orders', (0, orders_routes_1.createOrderRouter)({ userModel, orderModel, loteModel }));
    app.use('/api/seeds', (0, seeds_routes_1.createSeedRouter)({ seedModel }));
    app.use('/api/users', (0, users_routes_1.createUserRouter)({ userModel }));
    app.use('/api/lotes', (0, lotes_routes_1.createLotesRouter)({ loteModel }));
    app.use('/api/fertilizers', (0, fertilizer_routes_1.createFertilizerRouter)({ fertilizerModel }));
    (0, swagger_1.setupSwagger)(app);
    if (env_1.config.nodeEnv !== 'production') {
        const port = env_1.config.port;
        app.listen(port, () => {
            console.log(`🚀 Gaianix backend running on http://localhost:${port}`);
            console.log(`📑 Swagger docs: http://localhost:${port}/api/docs`);
        });
    }
    return app;
};
exports.createApp = createApp;
