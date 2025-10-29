"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelTestingSupabase = void 0;
const crypto_1 = require("crypto");
const mappings_1 = require("../../schemas/mappings");
const user_schema_1 = require("../../schemas/user.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const supabase_utils_1 = require("../../utils/supabase.utils");
class UserModelTestingSupabase {
    constructor(supabase) {
        this.Table = enums_1.ETablas.User;
        this.MapTable = mappings_1.TablasMap[this.Table];
        this.getAll = async () => {
            const query = (0, supabase_utils_1.querySelectSupabase)(this.Table);
            const { data } = await this.supabase.from(this.Table).select(query);
            if (data == null)
                return [];
            return data.map((row) => {
                const userResult = bd_services_1.BDService.getObjectFromTable(this.Table, row, true);
                return user_schema_1.userPrivateSchema.parse(userResult);
            });
        };
        this.getById = async (id) => {
            const mapTable = this.MapTable.map;
            if (mapTable.id == null)
                return undefined;
            const query = (0, supabase_utils_1.querySelectSupabase)(this.Table);
            const { data } = await this.supabase.from(this.Table).select(query).eq(mapTable.id, id).single();
            if (data == null)
                return undefined;
            const userResult = bd_services_1.BDService.getObjectFromTable(this.Table, data, true);
            return user_schema_1.userPrivateSchema.parse(userResult);
        };
        this.getByUsername = async (username) => {
            const mapTable = this.MapTable.map;
            if (mapTable.username == null)
                return undefined;
            const query = (0, supabase_utils_1.querySelectSupabase)(this.Table);
            const { data } = await this.supabase.from(this.Table).select(query).eq(mapTable.username, username).single();
            if (data == null)
                return undefined;
            const userResult = bd_services_1.BDService.getObjectFromTable(this.Table, data, true);
            return user_schema_1.userPrivateSchema.parse(userResult);
        };
        this.getByUsernameForLogin = async (username) => {
            const table = this.Table;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.username == null)
                return undefined;
            const query = (0, supabase_utils_1.querySelectSupabase)(this.Table);
            const { data } = await this.supabase.from(this.Table).select(query).eq(mapTable.username, username).single();
            if (data == null)
                return undefined;
            const userResult = bd_services_1.BDService.getObjectFromTable(this.Table, data, true);
            return user_schema_1.userSchema.parse(userResult);
        };
        this.create = async (user) => {
            const newUser = {
                ...user,
                id: (0, crypto_1.randomUUID)()
            };
            const values = (0, supabase_utils_1.getValuesToSupabase)(this.Table, newUser);
            const { error } = await this.supabase.from(this.Table).insert(values);
            if (error != null)
                throw new Error('Error al crear el usuario');
            return newUser;
        };
        this.supabase = supabase;
    }
}
exports.UserModelTestingSupabase = UserModelTestingSupabase;
