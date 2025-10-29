"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteModelLocalPostgres = void 0;
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../../config/db"));
const lote_schema_1 = require("../../schemas/lote.schema");
const mappings_1 = require("../../schemas/mappings");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
class LoteModelLocalPostgres {
    constructor() {
        this.getLotes = async () => {
            const table = enums_1.ETablas.Lote;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.codigo == null)
                return [];
            const result = await db_1.default.query(`${bd_services_1.BDService.querySelect(table)} ORDER BY ${mapTable.codigo}`);
            return result.rows.map((row) => {
                const loteDt = bd_services_1.BDService.getObjectFromTable(table, row);
                return lote_schema_1.loteSchema.parse(loteDt);
            });
        };
        this.getById = async (id) => {
            const table = enums_1.ETablas.Lote;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.id == null)
                return undefined;
            const result = await db_1.default.query(`${bd_services_1.BDService.querySelect(table)} WHERE ${mapTable.id} = $1`, [id]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const loteDt = bd_services_1.BDService.getObjectFromTable(table, result.rows[0]);
            return lote_schema_1.loteSchema.parse(loteDt);
        };
        this.create = async (seed) => {
            const newLote = {
                ...seed,
                id: (0, crypto_1.randomUUID)()
            };
            const datosInsert = bd_services_1.BDService.queryInsert(enums_1.ETablas.Lote, newLote);
            const result = await db_1.default.query(`${datosInsert.query}`, datosInsert.values);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al crear la semilla');
            return newLote;
        };
    }
}
exports.LoteModelLocalPostgres = LoteModelLocalPostgres;
