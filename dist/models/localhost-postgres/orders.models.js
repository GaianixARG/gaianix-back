"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModelLocalPostgres = void 0;
const order_schema_1 = require("../../schemas/order.schema");
const db_1 = __importDefault(require("../../config/db"));
const enums_1 = require("../../types/enums");
const bd_services_1 = require("../../services/bd.services");
const mappings_1 = require("../../schemas/mappings");
const crypto_1 = require("crypto");
const order_utils_1 = require("../../utils/order.utils");
const orderSiembra_models_1 = require("./orderSiembra.models");
const orderCosecha_models_1 = require("./orderCosecha.models");
const orderFertilizacion_models_1 = require("./orderFertilizacion.models");
class OrderModelLocalPostgres {
    constructor() {
        this.getAll = async () => {
            const mapTable = mappings_1.TablasMap[enums_1.ETablas.Order].map;
            if (mapTable.dateOfCreation == null)
                return [];
            const result = await db_1.default.query(`${(0, order_utils_1.querySelectOrdenByType)()} ORDER BY ${mapTable.dateOfCreation} DESC`);
            return result.rows.map((row) => {
                const orderDt = bd_services_1.BDService.getObjectFromTable(enums_1.ETablas.Order, row);
                return order_schema_1.orderSchema.parse(orderDt);
            });
        };
        this.getById = async (id) => {
            const table = enums_1.ETablas.Order;
            const mapTable = mappings_1.TablasMap[table].map;
            if (mapTable.id == null)
                return undefined;
            const result = await db_1.default.query(`${(0, order_utils_1.querySelectOrdenByType)()} WHERE ${mapTable.id} = $1`, [id]);
            if (result.rowCount == null || result.rowCount === 0)
                return undefined;
            const orderDt = bd_services_1.BDService.getObjectFromTable(table, result.rows[0]);
            return order_schema_1.orderSchema.parse(orderDt);
        };
        this.getByType = async (type) => {
            switch (type) {
                case enums_1.EOrderType.Siembra: return await this.models.orderSiembraModel.getAll();
                case enums_1.EOrderType.Cosecha: return await this.models.orderCosechaModel.getAll();
                case enums_1.EOrderType.Fertilizacion: return await this.models.orderFertilizacionModel.getAll();
                default: return [];
            }
        };
        this.create = async (order, creator, lote) => {
            const nuevoCodigoOrden = await this.getNewCodeOrder(order.type);
            if (nuevoCodigoOrden === '')
                throw new Error('Error al crear la orden de trabajo');
            const orderBase = {
                ...order,
                lote,
                creator,
                codigo: nuevoCodigoOrden,
                dateOfCreation: new Date().toISOString(),
                id: (0, crypto_1.randomUUID)()
            };
            const newOrder = await this.createOrderByType(orderBase, order);
            if (newOrder == null)
                throw new Error('Error al crear la orden de trabajo');
            const queryInsertOdt = bd_services_1.BDService.queryInsert(enums_1.ETablas.Order, newOrder);
            const result = await db_1.default.query(queryInsertOdt.query, queryInsertOdt.values);
            if (result.rowCount == null || result.rowCount === 0)
                throw new Error('Error al crear la orden de trabajo');
            return newOrder;
        };
        this.update = async (order) => {
            const { ...restOfOrder } = order;
            let orderToUpdate;
            if (restOfOrder.type === enums_1.EOrderType.Siembra) {
                const { siembra, ...restOfSiembra } = restOfOrder;
                orderToUpdate = restOfSiembra;
                await this.models.orderSiembraModel.update(siembra);
            }
            if (restOfOrder.type === enums_1.EOrderType.Cosecha) {
                const { cosecha, ...restOfCosecha } = restOfOrder;
                orderToUpdate = restOfCosecha;
                await this.models.orderCosechaModel.update(cosecha);
            }
            if (restOfOrder.type === enums_1.EOrderType.Fertilizacion) {
                const { fertilizacion, ...restOfFert } = restOfOrder;
                orderToUpdate = restOfFert;
                await this.models.orderFertilizacionModel.update(fertilizacion);
            }
            if (orderToUpdate == null)
                throw new Error('Error al actualizar la orden');
            const { id, ...toUpdate } = orderToUpdate;
            const datosUpdate = bd_services_1.BDService.queryUpdate(enums_1.ETablas.Order, toUpdate, true);
            const result = await db_1.default.query(datosUpdate.query, [...datosUpdate.values, id]);
            if (result == null || result.rowCount === 0)
                throw new Error('Error al actualizar el fertilizante');
        };
        this.remove = async (id) => {
            await this.removeByType(id);
            const query = bd_services_1.BDService.queryRemoveById(enums_1.ETablas.Order);
            await db_1.default.query(query, [id]);
        };
        // #region Utils
        // #region CreateOrder
        this.getNewCodeOrder = async (type) => {
            const result = await db_1.default.query((0, order_utils_1.queryGetNewCode)(type));
            if (result.rowCount == null || result.rowCount === 0)
                throw new Error('Error al definir el codigo');
            return result.rows[0]?.codigo ?? '';
        };
        this.createOrderByType = async (orderBase, order) => {
            if (order.type === enums_1.EOrderType.Siembra)
                return await this.models.orderSiembraModel.create(orderBase, order.siembra);
            if (order.type === enums_1.EOrderType.Cosecha)
                return await this.models.orderCosechaModel.create(orderBase, order.cosecha);
            if (order.type === enums_1.EOrderType.Fertilizacion)
                return await this.models.orderFertilizacionModel.create(orderBase, order.fertilizacion);
            return null;
        };
        // #endregion
        // #region RemoveOrder
        this.removeByType = async (orderId) => {
            await this.models.orderSiembraModel.remove(orderId);
            await this.models.orderFertilizacionModel.remove(orderId);
            await this.models.orderCosechaModel.remove(orderId);
        };
        this.models = {
            orderSiembraModel: new orderSiembra_models_1.OrderSiembraModelLocalPostgres(),
            orderCosechaModel: new orderCosecha_models_1.OrderCosechaModelLocalPostgres(),
            orderFertilizacionModel: new orderFertilizacion_models_1.OrderFertilizacionModelLocalPostgres()
        };
    }
}
exports.OrderModelLocalPostgres = OrderModelLocalPostgres;
