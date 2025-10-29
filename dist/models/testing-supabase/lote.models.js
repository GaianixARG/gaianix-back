"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteModelTestingSupabase = void 0;
const crypto_1 = require("crypto");
const lote_schema_1 = require("../../schemas/lote.schema");
const mappings_1 = require("../../schemas/mappings");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const supabase_utils_1 = require("../../utils/supabase.utils");
class LoteModelTestingSupabase {
    constructor(supabase) {
        this.Table = enums_1.ETablas.Lote;
        this.MapTable = mappings_1.TablasMap[this.Table];
        this.getLotes = async () => {
            const mapTable = this.MapTable.map;
            if (mapTable.codigo == null)
                return [];
            const query = (0, supabase_utils_1.querySelectSupabase)(this.Table);
            const { data } = await this.supabase.from(this.Table).select(query).order(mapTable.codigo);
            if (data == null)
                return [];
            return data.map((row) => {
                const loteDt = bd_services_1.BDService.getObjectFromTable(this.Table, row, true);
                return lote_schema_1.loteSchema.parse(loteDt);
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
            const loteDt = bd_services_1.BDService.getObjectFromTable(this.Table, data, true);
            return lote_schema_1.loteSchema.parse(loteDt);
        };
        this.create = async (lote) => {
            const newLote = {
                ...lote,
                id: (0, crypto_1.randomUUID)()
            };
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, newLote);
            if (error != null)
                throw new Error('Error al crear el lote');
            return newLote;
        };
        this.supabase = supabase;
    }
}
exports.LoteModelTestingSupabase = LoteModelTestingSupabase;
