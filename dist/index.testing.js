"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const supabase_1 = require("./config/supabase");
const fertilizer_models_1 = require("./models/testing-supabase/fertilizer.models");
const lote_models_1 = require("./models/testing-supabase/lote.models");
const orders_models_1 = require("./models/testing-supabase/orders.models");
const seeds_models_1 = require("./models/testing-supabase/seeds.models");
const users_models_1 = require("./models/testing-supabase/users.models");
const client = new supabase_1.Supabase().getAccess();
(0, app_1.createApp)({
    orderModel: new orders_models_1.OrderModelTestingSupabase(client),
    seedModel: new seeds_models_1.SeedModelTestingSupabase(client),
    userModel: new users_models_1.UserModelTestingSupabase(client),
    loteModel: new lote_models_1.LoteModelTestingSupabase(client),
    fertilizerModel: new fertilizer_models_1.FertilizerModelTestingSupabase(client)
});
