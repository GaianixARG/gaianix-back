"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModelTestingSupabase = void 0;
const order_schema_1 = require("../../schemas/order.schema");
const enums_1 = require("../../types/enums");
const bd_services_1 = require("../../services/bd.services");
const mappings_1 = require("../../schemas/mappings");
const crypto_1 = require("crypto");
const orderCosecha_models_1 = require("./orderCosecha.models");
const orderFertilizacion_models_1 = require("./orderFertilizacion.models");
const orderSiembra_models_1 = require("./orderSiembra.models");
const order_utils_1 = require("../../utils/order.utils");
const supabase_utils_1 = require("../../utils/supabase.utils");
class OrderModelTestingSupabase {
    constructor(supabase) {
        this.Table = enums_1.ETablas.Order;
        this.MapTable = mappings_1.TablasMap[this.Table];
        this.getAll = async () => {
            const mapTable = this.MapTable.map;
            if (mapTable.dateOfCreation == null || mapTable.type == null)
                return [];
            const query = (0, order_utils_1.querySelectOrdenByTypeSupabase)();
            const { data } = await this.supabase.from(this.Table).select(query).order(mapTable.dateOfCreation);
            if (data == null)
                return [];
            return data.map((row) => {
                const orderDt = bd_services_1.BDService.getObjectFromTable(enums_1.ETablas.Order, row, true);
                return order_schema_1.orderSchema.parse(orderDt);
            });
        };
        this.getById = async (id) => {
            const orderSiembra = await this.models.orderSiembraModel.getById(id);
            if (orderSiembra != null)
                return orderSiembra;
            const orderFert = await this.models.orderFertilizacionModel.getById(id);
            if (orderFert != null)
                return orderFert;
            const orderCosecha = await this.models.orderCosechaModel.getById(id);
            if (orderCosecha != null)
                return orderSiembra;
            return undefined;
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
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, newOrder);
            if (error != null)
                throw new Error('Error al crear la orden de trabajo');
            return newOrder;
        };
        this.update = async (order) => {
            let orderToUpdate;
            if (order.type === enums_1.EOrderType.Siembra) {
                const { siembra, ...restOfSiembra } = order;
                orderToUpdate = restOfSiembra;
                await this.models.orderSiembraModel.update(siembra);
            }
            if (order.type === enums_1.EOrderType.Cosecha) {
                const { cosecha, ...restOfCosecha } = order;
                orderToUpdate = restOfCosecha;
                await this.models.orderCosechaModel.update(cosecha);
            }
            if (order.type === enums_1.EOrderType.Fertilizacion) {
                const { fertilizacion, ...restOfFert } = order;
                orderToUpdate = restOfFert;
                await this.models.orderFertilizacionModel.update(fertilizacion);
            }
            if (orderToUpdate == null)
                throw new Error('Error al actualizar la orden');
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, orderToUpdate);
            if (error != null)
                throw new Error('Error al crear la orden de trabajo');
        };
        this.remove = async (id) => {
            const orderToDelete = await this.getById(id);
            if (orderToDelete == null)
                return;
            await this.removeByType(orderToDelete);
            const mapTable = this.MapTable.map;
            if (mapTable.id == null)
                return;
            await this.supabase.from(this.Table).delete().eq(mapTable.id, id);
        };
        // #region Utils
        // #region CreateOrder
        this.getNewCodeOrder = async (type) => {
            const { data } = await this.supabase.rpc('get_new_code_order', { type });
            if (data == null || data.length === 0)
                throw new Error('Error al definir el codigo');
            return data[0] ?? '';
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
        this.removeByType = async (order) => {
            switch (order.type) {
                case enums_1.EOrderType.Siembra: return await this.models.orderSiembraModel.removeSiembra(order);
                case enums_1.EOrderType.Cosecha: return await this.models.orderCosechaModel.removeCosecha(order);
                case enums_1.EOrderType.Fertilizacion: return await this.models.orderFertilizacionModel.removeFertilizacion(order);
            }
        };
        this.supabase = supabase;
        this.models = {
            orderSiembraModel: new orderSiembra_models_1.OrderSiembraModelTestingSupabase(supabase),
            orderCosechaModel: new orderCosecha_models_1.OrderCosechaModelTestingSupabase(supabase),
            orderFertilizacionModel: new orderFertilizacion_models_1.OrderFertilizacionModelTestingSupabase(supabase)
        };
    }
}
exports.OrderModelTestingSupabase = OrderModelTestingSupabase;
