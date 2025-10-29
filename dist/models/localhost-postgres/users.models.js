"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelLocalPostgres = void 0;
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../../config/db"));
const mappings_1 = require("../../schemas/mappings");
const user_schema_1 = require("../../schemas/user.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const querySelectUser = () => `
  SELECT * FROM "${enums_1.ETablas.User}"
    ${bd_services_1.BDService.queryJoin('INNER', enums_1.ETablas.User, enums_1.ETablas.Rol)}
`;
class UserModelLocalPostgres {
    constructor() {
        this.getAll = async () => {
            const result = await db_1.default.query(querySelectUser());
            return result.rows.map((row) => {
                const userResult = bd_services_1.BDService.getObjectFromTable(enums_1.ETablas.User, row);
                return user_schema_1.userPrivateSchema.parse(userResult);
            });
        };
        this.getById = async (id) => {
            const table = enums_1.ETablas.User;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.id == null)
                return undefined;
            const result = await db_1.default.query(`${querySelectUser()} WHERE ${mapTable.id} = $1`, [id]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const userResult = bd_services_1.BDService.getObjectFromTable(enums_1.ETablas.User, result.rows[0]);
            return user_schema_1.userPrivateSchema.parse(userResult);
        };
        this.getByUsername = async (username) => {
            const table = enums_1.ETablas.User;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.username == null)
                return undefined;
            const result = await db_1.default.query(`${querySelectUser()} WHERE ${mapTable.username} = $1`, [username]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const userResult = bd_services_1.BDService.getObjectFromTable(enums_1.ETablas.User, result.rows[0]);
            return user_schema_1.userPrivateSchema.parse(userResult);
        };
        this.getByUsernameForLogin = async (username) => {
            const table = enums_1.ETablas.User;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.username == null)
                return undefined;
            const result = await db_1.default.query(`${querySelectUser()} WHERE ${mapTable.username} = $1`, [username]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const userResult = bd_services_1.BDService.getObjectFromTable(enums_1.ETablas.User, result.rows[0]);
            return user_schema_1.userSchema.parse(userResult);
        };
        this.create = async (user) => {
            const newUser = {
                ...user,
                id: (0, crypto_1.randomUUID)()
            };
            const dataInsert = bd_services_1.BDService.queryInsert(enums_1.ETablas.User, newUser);
            const result = await db_1.default.query(dataInsert.query, dataInsert.values);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al crear el usuario');
            return newUser;
        };
    }
}
exports.UserModelLocalPostgres = UserModelLocalPostgres;
