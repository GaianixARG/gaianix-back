"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModelTestingSupabase = void 0;
const crypto_1 = require("crypto");
const mappings_1 = require("../../schemas/mappings");
const seed_schema_1 = require("../../schemas/seed.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const supabase_utils_1 = require("../../utils/supabase.utils");
class SeedModelTestingSupabase {
    constructor(supabase) {
        this.Table = enums_1.ETablas.Seed;
        this.MapTable = mappings_1.TablasMap[this.Table];
        this.getAll = async () => {
            const mapTable = this.MapTable.map;
            if (mapTable.type == null)
                return [];
            const { data } = await this.supabase.from(this.Table).select().order(mapTable.type);
            if (data == null)
                return [];
            return data.map((row) => {
                const seedDt = bd_services_1.BDService.getObjectFromTable(this.Table, row, true);
                return seed_schema_1.seedSchema.parse(seedDt);
            });
        };
        this.getById = async (id) => {
            const mapTable = this.MapTable.map;
            if (mapTable.id == null)
                return undefined;
            const { data } = await this.supabase.from(this.Table).select().eq(mapTable.id, id).single();
            if (data == null)
                return undefined;
            const seedDt = bd_services_1.BDService.getObjectFromTable(this.Table, data, true);
            return seed_schema_1.seedSchema.parse(seedDt);
        };
        this.create = async (seed) => {
            const newSeed = {
                ...seed,
                id: (0, crypto_1.randomUUID)()
            };
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, newSeed);
            if (error != null)
                throw new Error('Error al crear la semilla');
            return newSeed;
        };
        this.update = async (seed) => {
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, seed);
            if (error != null)
                throw new Error('Error al actualizar la semilla');
        };
        this.remove = async (id) => {
            const mapTable = this.MapTable.map;
            if (mapTable.id == null)
                return;
            await this.supabase.from(this.Table).delete().eq(mapTable.id, id);
        };
        this.supabase = supabase;
    }
}
exports.SeedModelTestingSupabase = SeedModelTestingSupabase;
