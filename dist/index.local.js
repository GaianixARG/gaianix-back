"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const fertilizer_models_1 = require("./models/localhost-postgres/fertilizer.models");
const lote_models_1 = require("./models/localhost-postgres/lote.models");
const orders_models_1 = require("./models/localhost-postgres/orders.models");
const seeds_models_1 = require("./models/localhost-postgres/seeds.models");
const users_models_1 = require("./models/localhost-postgres/users.models");
(0, app_1.createApp)({
    orderModel: new orders_models_1.OrderModelLocalPostgres(),
    seedModel: new seeds_models_1.SeedModelLocalPostgres(),
    userModel: new users_models_1.UserModelLocalPostgres(),
    loteModel: new lote_models_1.LoteModelLocalPostgres(),
    fertilizerModel: new fertilizer_models_1.FertilizerModelLocalPostgres()
});
