"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCosechaModelLocalPostgres = void 0;
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../../config/db"));
const order_schema_1 = require("../../schemas/order.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const mappings_1 = require("../../schemas/mappings");
const order_utils_1 = require("../../utils/order.utils");
const querySelectOrdenCosecha = () => {
    return (0, order_utils_1.querySelectOrdenByType)(enums_1.EOrderType.Cosecha);
};
class OrderCosechaModelLocalPostgres {
    constructor() {
        this.getAll = async () => {
            const table = enums_1.ETablas.Order;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.dateOfCreation == null || mapTable.type == null)
                return [];
            const result = await db_1.default.query(`${querySelectOrdenCosecha()} WHERE ${mapTable.type} = $1 ORDER BY ${mapTable.dateOfCreation} DESC`, [enums_1.EOrderType.Cosecha]);
            return result.rows.map((row) => {
                const orderDt = bd_services_1.BDService.getObjectFromTable(table, row);
                return order_schema_1.orderCosechaSchema.parse(orderDt);
            });
        };
        this.getById = async (id) => {
            const table = enums_1.ETablas.Order;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.id == null)
                return undefined;
            const result = await db_1.default.query(`${querySelectOrdenCosecha()} WHERE ${mapTable.id} = $1`, [id]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const orderDt = bd_services_1.BDService.getObjectFromTable(table, result.rows[0]);
            return order_schema_1.orderCosechaSchema.parse(orderDt);
        };
        this.create = async (orderBase, datosCosecha) => {
            return {
                ...orderBase,
                type: enums_1.EOrderType.Cosecha,
                cosecha: await this.createDataOrdenCosecha(datosCosecha)
            };
        };
        this.update = async (datosCosecha) => {
            const { id, ...restOfCosecha } = datosCosecha;
            const datosUpdate = bd_services_1.BDService.queryUpdate(enums_1.ETablas.OrdenSiembra, restOfCosecha, true);
            const result = await db_1.default.query(datosUpdate.query, [...datosUpdate.values, id]);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al actualizar la orden de cosecha');
        };
        this.remove = async (orderId) => {
            const qOrderCosecha = bd_services_1.BDService.queryRemoveByRel(enums_1.ETablas.OrdenCosecha, enums_1.ETablas.Order);
            await db_1.default.query(qOrderCosecha, [orderId]);
            const qOrder = bd_services_1.BDService.queryRemoveById(enums_1.ETablas.Order);
            await db_1.default.query(qOrder, [orderId]);
        };
        this.removeCosecha = async (_) => { };
        // #region Utils
        this.createDataOrdenCosecha = async (datos) => {
            const tabla = enums_1.ETablas.OrdenCosecha;
            const newDatosCosecha = {
                ...datos,
                id: (0, crypto_1.randomUUID)()
            };
            const queryInsertDatos = bd_services_1.BDService.queryInsert(tabla, newDatosCosecha);
            const result = await db_1.default.query(queryInsertDatos.query, queryInsertDatos.values);
            if (result.rowCount == null || result.rowCount === 0)
                throw new Error('Error al insertar los datos de la cosecha');
            return newDatosCosecha;
        };
        // #endregion
    }
}
exports.OrderCosechaModelLocalPostgres = OrderCosechaModelLocalPostgres;
