"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
class Supabase {
    constructor() {
        this.getAccess = () => this.client;
        this.client = (0, supabase_js_1.createClient)(env_1.config.projectUrlSupabase, env_1.config.apyKeySupabase);
    }
}
exports.Supabase = Supabase;
// const supabase = config.projectUrlSupabase === '' ? undefined : createClient(config.projectUrlSupabase, config.apyKeySupabase)
// export default supabase
