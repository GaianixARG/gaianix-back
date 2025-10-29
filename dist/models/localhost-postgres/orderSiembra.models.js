"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSiembraModelLocalPostgres = void 0;
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../../config/db"));
const mappings_1 = require("../../schemas/mappings");
const order_schema_1 = require("../../schemas/order.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const order_utils_1 = require("../../utils/order.utils");
const querySelectOrdenSiembra = () => {
    return (0, order_utils_1.querySelectOrdenByType)(enums_1.EOrderType.Siembra);
};
class OrderSiembraModelLocalPostgres {
    constructor() {
        this.getAll = async () => {
            const table = enums_1.ETablas.Order;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.dateOfCreation == null || mapTable.type == null)
                return [];
            const result = await db_1.default.query(`${querySelectOrdenSiembra()} WHERE ${mapTable.type} = $1 ORDER BY ${mapTable.dateOfCreation} DESC`, [enums_1.EOrderType.Siembra]);
            return result.rows.map((row) => {
                const orderDt = bd_services_1.BDService.getObjectFromTable(table, row);
                return order_schema_1.orderSiembraSchema.parse(orderDt);
            });
        };
        this.getById = async (id) => {
            const table = enums_1.ETablas.Order;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.id == null)
                return undefined;
            const result = await db_1.default.query(`${querySelectOrdenSiembra()} WHERE ${mapTable.id} = $1`, [id]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const orderDt = bd_services_1.BDService.getObjectFromTable(table, result.rows[0]);
            return order_schema_1.orderSiembraSchema.parse(orderDt);
        };
        this.create = async (orderBase, datosSiembra) => {
            return {
                ...orderBase,
                type: enums_1.EOrderType.Siembra,
                siembra: await this.createDataOrdenSiembra(datosSiembra)
            };
        };
        this.update = async (datosSiembra) => {
            const { id, ...restOfSiembra } = datosSiembra;
            await this.updateDatosSemillaPorSiembra(restOfSiembra.datosSemilla);
            const datosUpdate = bd_services_1.BDService.queryUpdate(enums_1.ETablas.OrdenSiembra, restOfSiembra, true);
            const result = await db_1.default.query(datosUpdate.query, [...datosUpdate.values, id]);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al actualizar la orden de siembra');
        };
        this.remove = async (orderId) => {
            await this.removeOrderSiembra(orderId);
            const query = bd_services_1.BDService.queryRemoveById(enums_1.ETablas.Order);
            await db_1.default.query(query, [orderId]);
        };
        this.removeSiembra = async (_) => { };
        // #region Utils
        // #region Create
        this.createDataSemillaPorSiembra = async (datos) => {
            const tabla = enums_1.ETablas.SemillaPorSiembra;
            const newDatosSemilla = {
                ...datos,
                id: (0, crypto_1.randomUUID)()
            };
            const queryInsertDatos = bd_services_1.BDService.queryInsert(tabla, newDatosSemilla);
            const result = await db_1.default.query(queryInsertDatos.query, queryInsertDatos.values);
            if (result.rowCount == null || result.rowCount === 0)
                throw new Error('Error al insertar los datos de la siembra');
            return newDatosSemilla;
        };
        this.createDataOrdenSiembra = async (datos) => {
            // creo la asociación con la semilla (SemillaXSiembra)
            const semillaXSiembra = await this.createDataSemillaPorSiembra(datos.datosSemilla);
            const tabla = enums_1.ETablas.OrdenSiembra;
            const newDatosSiembra = {
                ...datos,
                datosSemilla: semillaXSiembra,
                id: (0, crypto_1.randomUUID)()
            };
            const queryInsertDatos = bd_services_1.BDService.queryInsert(tabla, newDatosSiembra);
            const result = await db_1.default.query(queryInsertDatos.query, queryInsertDatos.values);
            if (result.rowCount == null || result.rowCount === 0)
                throw new Error('Error al insertar la Orden de Trabajo de Siembra');
            return newDatosSiembra;
        };
        // #endregion
        // #region Update
        this.updateDatosSemillaPorSiembra = async (datos) => {
            const { id, ...restOfData } = datos;
            const datosUpdate = bd_services_1.BDService.queryUpdate(enums_1.ETablas.SemillaPorSiembra, restOfData, true);
            const result = await db_1.default.query(datosUpdate.query, [...datosUpdate.values, id]);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al actualizar la orden de siembra');
        };
        // #endregion
        // #region Remove
        this.removeDatosSemillaSiembra = async (orderId) => {
            const query = bd_services_1.BDService.queryRemoveByRel(enums_1.ETablas.SemillaPorSiembra, enums_1.ETablas.Order);
            await db_1.default.query(query, [orderId]);
        };
        this.removeOrderSiembra = async (orderId) => {
            await this.removeDatosSemillaSiembra(orderId);
            const query = bd_services_1.BDService.queryRemoveByRel(enums_1.ETablas.OrdenSiembra, enums_1.ETablas.Order);
            await db_1.default.query(query, [orderId]);
        };
        // #endregion
        // #endregion
    }
}
exports.OrderSiembraModelLocalPostgres = OrderSiembraModelLocalPostgres;
