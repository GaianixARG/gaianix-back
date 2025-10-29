"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FertilizerModelTestingSupabase = void 0;
const crypto_1 = require("crypto");
const fertilizer_schema_1 = require("../../schemas/fertilizer.schema");
const mappings_1 = require("../../schemas/mappings");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const supabase_utils_1 = require("../../utils/supabase.utils");
class FertilizerModelTestingSupabase {
    constructor(supabase) {
        this.Table = enums_1.ETablas.Fertilizante;
        this.MapTable = mappings_1.TablasMap[this.Table];
        this.getAll = async () => {
            const mapTable = this.MapTable.map;
            if (mapTable.name == null)
                return [];
            const { data } = await this.supabase.from(this.Table).select().order(mapTable.name);
            if (data == null)
                return [];
            return data.map((row) => {
                const fertilizerDt = bd_services_1.BDService.getObjectFromTable(this.Table, row, true);
                return fertilizer_schema_1.fertilizerSchema.parse(fertilizerDt);
            });
        };
        this.getById = async (id) => {
            const mapTable = this.MapTable.map;
            if (mapTable.id == null)
                return undefined;
            const { data } = await this.supabase.from(this.Table).select().eq(mapTable.id, id).single();
            if (data == null)
                return undefined;
            const fertilizerDt = bd_services_1.BDService.getObjectFromTable(this.Table, data, true);
            return fertilizer_schema_1.fertilizerSchema.parse(fertilizerDt);
        };
        this.create = async (fertilizer) => {
            const newFertilizer = {
                ...fertilizer,
                id: (0, crypto_1.randomUUID)()
            };
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, newFertilizer);
            if (error != null)
                throw new Error('Error al crear el fertilizante');
            return newFertilizer;
        };
        this.update = async (fertilizer) => {
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, fertilizer);
            if (error != null)
                throw new Error('Error al actualizar el fertilizante');
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
exports.FertilizerModelTestingSupabase = FertilizerModelTestingSupabase;
