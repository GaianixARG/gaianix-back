"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModelLocalPostgres = void 0;
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../../config/db"));
const mappings_1 = require("../../schemas/mappings");
const seed_schema_1 = require("../../schemas/seed.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
class SeedModelLocalPostgres {
    constructor() {
        this.getAll = async () => {
            const table = enums_1.ETablas.Seed;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.type == null)
                return [];
            const result = await db_1.default.query(`SELECT * FROM "${table}" ORDER BY ${mapTable.type} DESC`);
            return result.rows.map((row) => {
                const seedDt = bd_services_1.BDService.getObjectFromTable(table, row);
                return seed_schema_1.seedSchema.parse(seedDt);
            });
        };
        this.getById = async (id) => {
            const table = enums_1.ETablas.Seed;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.id == null)
                return undefined;
            const result = await db_1.default.query(`${bd_services_1.BDService.querySelect(table)} WHERE ${mapTable.id} = $1`, [id]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const seedDt = bd_services_1.BDService.getObjectFromTable(table, result.rows[0]);
            return seed_schema_1.seedSchema.parse(seedDt);
        };
        this.create = async (seed) => {
            const newSeed = {
                ...seed,
                id: (0, crypto_1.randomUUID)()
            };
            const datosInsert = bd_services_1.BDService.queryInsert(enums_1.ETablas.Seed, newSeed);
            const result = await db_1.default.query(`${datosInsert.query}`, datosInsert.values);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al crear la semilla');
            return newSeed;
        };
        this.update = async (seed) => {
            const { id, ...updateSeed } = seed;
            const datosUpdate = bd_services_1.BDService.queryUpdate(enums_1.ETablas.Seed, updateSeed, true);
            const result = await db_1.default.query(datosUpdate.query, [...datosUpdate.values, id]);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al actualizar la semilla');
        };
        this.remove = async (id) => {
            const queryRemove = bd_services_1.BDService.queryRemoveById(enums_1.ETablas.Seed);
            if (queryRemove === '')
                throw new Error('Error al eliminar la semilla');
            await db_1.default.query(queryRemove, [id]);
        };
    }
}
exports.SeedModelLocalPostgres = SeedModelLocalPostgres;
