"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderFertilizacionModelLocalPostgres = void 0;
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../../config/db"));
const mappings_1 = require("../../schemas/mappings");
const order_schema_1 = require("../../schemas/order.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const order_utils_1 = require("../../utils/order.utils");
const querySelectOrdenFertilizacion = () => {
    return (0, order_utils_1.querySelectOrdenByType)(enums_1.EOrderType.Fertilizacion);
};
class OrderFertilizacionModelLocalPostgres {
    constructor() {
        this.getAll = async () => {
            const table = enums_1.ETablas.Order;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.dateOfCreation == null || mapTable.type == null)
                return [];
            const result = await db_1.default.query(`${querySelectOrdenFertilizacion()} WHERE ${mapTable.type} = $1 ORDER BY ${mapTable.dateOfCreation} DESC`, [enums_1.EOrderType.Fertilizacion]);
            return result.rows.map((row) => {
                const orderDt = bd_services_1.BDService.getObjectFromTable(table, row);
                return order_schema_1.orderFertilizacionSchema.parse(orderDt);
            });
        };
        this.getById = async (id) => {
            const table = enums_1.ETablas.Order;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.id == null)
                return undefined;
            const result = await db_1.default.query(`${querySelectOrdenFertilizacion()} WHERE ${mapTable.id} = $1`, [id]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const orderDt = bd_services_1.BDService.getObjectFromTable(table, result.rows[0]);
            return order_schema_1.orderFertilizacionSchema.parse(orderDt);
        };
        this.create = async (orderBase, datosFertilizacion) => {
            return {
                ...orderBase,
                type: enums_1.EOrderType.Fertilizacion,
                fertilizacion: await this.createDataOrdenFertilizacion(datosFertilizacion)
            };
        };
        this.update = async (datosFertilizacion) => {
            const { id, ...restOfFert } = datosFertilizacion;
            const datosUpdate = bd_services_1.BDService.queryUpdate(enums_1.ETablas.OrdenFertilizacion, restOfFert, true);
            const result = await db_1.default.query(datosUpdate.query, [...datosUpdate.values, id]);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al actualizar la orden de fertilizacion');
        };
        this.remove = async (orderId) => {
            const qOrderCosecha = bd_services_1.BDService.queryRemoveByRel(enums_1.ETablas.OrdenFertilizacion, enums_1.ETablas.Order);
            await db_1.default.query(qOrderCosecha, [orderId]);
            const qOrder = bd_services_1.BDService.queryRemoveById(enums_1.ETablas.Order);
            await db_1.default.query(qOrder, [orderId]);
        };
        this.removeFertilizacion = async (_) => { };
        // #region Utils
        this.createDataOrdenFertilizacion = async (datos) => {
            const tabla = enums_1.ETablas.OrdenFertilizacion;
            const newDatosFertilizacion = {
                ...datos,
                id: (0, crypto_1.randomUUID)()
            };
            const queryInsertDatos = bd_services_1.BDService.queryInsert(tabla, newDatosFertilizacion);
            const result = await db_1.default.query(queryInsertDatos.query, queryInsertDatos.values);
            if (result.rowCount == null || result.rowCount === 0)
                throw new Error('Error al insertar los datos de la fertlizacion');
            return newDatosFertilizacion;
        };
        // #endregion
    }
}
exports.OrderFertilizacionModelLocalPostgres = OrderFertilizacionModelLocalPostgres;
