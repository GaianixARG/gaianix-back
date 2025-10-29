"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FertilizerModelLocalPostgres = void 0;
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../../config/db"));
const fertilizer_schema_1 = require("../../schemas/fertilizer.schema");
const mappings_1 = require("../../schemas/mappings");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
class FertilizerModelLocalPostgres {
    constructor() {
        this.getAll = async () => {
            const table = enums_1.ETablas.Fertilizante;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.name == null)
                return [];
            const result = await db_1.default.query(`${bd_services_1.BDService.querySelect(table)} ORDER BY ${mapTable.name}`);
            return result.rows.map((row) => {
                const fertilizerDt = bd_services_1.BDService.getObjectFromTable(table, row);
                return fertilizer_schema_1.fertilizerSchema.parse(fertilizerDt);
            });
        };
        this.getById = async (id) => {
            const table = enums_1.ETablas.Fertilizante;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.id == null)
                return undefined;
            const result = await db_1.default.query(`${bd_services_1.BDService.querySelect(table)} WHERE ${mapTable.id} = $1`, [id]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const fertilizerDt = bd_services_1.BDService.getObjectFromTable(table, result.rows[0]);
            return fertilizer_schema_1.fertilizerSchema.parse(fertilizerDt);
        };
        this.create = async (fertilizer) => {
            const newFertilizer = {
                ...fertilizer,
                id: (0, crypto_1.randomUUID)()
            };
            const datosInsert = bd_services_1.BDService.queryInsert(enums_1.ETablas.Fertilizante, newFertilizer);
            const result = await db_1.default.query(`${datosInsert.query}`, datosInsert.values);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al crear el fertilizante');
            return newFertilizer;
        };
        this.update = async (fertilizer) => {
            const { id, ...updateFertilizer } = fertilizer;
            const datosUpdate = bd_services_1.BDService.queryUpdate(enums_1.ETablas.Fertilizante, updateFertilizer, true);
            const result = await db_1.default.query(datosUpdate.query, [...datosUpdate.values, id]);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al actualizar el fertilizante');
        };
        this.remove = async (id) => {
            const queryRemove = bd_services_1.BDService.queryRemoveById(enums_1.ETablas.Fertilizante);
            if (queryRemove === '')
                throw new Error('Error al eliminar el fertilizante');
            await db_1.default.query(queryRemove, [id]);
        };
    }
}
exports.FertilizerModelLocalPostgres = FertilizerModelLocalPostgres;
