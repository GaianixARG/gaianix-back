"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCosechaModelTestingSupabase = void 0;
const crypto_1 = require("crypto");
const order_schema_1 = require("../../schemas/order.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const mappings_1 = require("../../schemas/mappings");
const order_utils_1 = require("../../utils/order.utils");
const supabase_utils_1 = require("../../utils/supabase.utils");
class OrderCosechaModelTestingSupabase {
    constructor(supabase) {
        this.Table = enums_1.ETablas.OrdenCosecha;
        this.MapTable = mappings_1.TablasMap[this.Table].map;
        this.getAll = async () => {
            const tableOrder = enums_1.ETablas.Order;
            const mapTableOrder = mappings_1.TablasMap[tableOrder].map;
            if (mapTableOrder.dateOfCreation == null || mapTableOrder.type == null)
                return [];
            const query = (0, order_utils_1.querySelectOrdenByTypeSupabase)(enums_1.EOrderType.Cosecha);
            const { data } = await this.supabase.from(tableOrder).select(query).eq(mapTableOrder.type, enums_1.EOrderType.Cosecha).order(mapTableOrder.dateOfCreation);
            if (data == null)
                return [];
            return data.map((row) => {
                const orderDt = bd_services_1.BDService.getObjectFromTable(tableOrder, row, true);
                console.log(orderDt);
                return order_schema_1.orderCosechaSchema.parse(orderDt);
            });
        };
        this.getById = async (id) => {
            const tableOrder = enums_1.ETablas.Order;
            const mapTableOrder = mappings_1.TablasMap[tableOrder].map;
            if (mapTableOrder.id == null)
                return undefined;
            const query = (0, order_utils_1.querySelectOrdenByTypeSupabase)(enums_1.EOrderType.Cosecha);
            const { data } = await this.supabase.from(tableOrder).select(query).eq(mapTableOrder.id, id).single();
            if (data == null)
                return undefined;
            const orderDt = bd_services_1.BDService.getObjectFromTable(tableOrder, data, true);
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
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, datosCosecha);
            if (error != null)
                throw new Error('Error al actualizar la orden de cosecha');
        };
        this.remove = async (_) => { };
        this.removeCosecha = async (orderCosecha) => {
            const mapTable = this.MapTable;
            if (mapTable.id == null)
                return;
            await this.supabase.from(this.Table).delete().eq(mapTable.id, orderCosecha.cosecha.id);
        };
        this.createDataOrdenCosecha = async (datos) => {
            const newDatosCosecha = {
                ...datos,
                id: (0, crypto_1.randomUUID)()
            };
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, newDatosCosecha);
            if (error != null)
                throw new Error('Error al insertar los datos de la cosecha');
            return newDatosCosecha;
        };
        this.supabase = supabase;
    }
}
exports.OrderCosechaModelTestingSupabase = OrderCosechaModelTestingSupabase;
