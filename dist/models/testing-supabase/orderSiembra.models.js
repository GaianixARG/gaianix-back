"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSiembraModelTestingSupabase = void 0;
const crypto_1 = require("crypto");
const mappings_1 = require("../../schemas/mappings");
const order_schema_1 = require("../../schemas/order.schema");
const bd_services_1 = require("../../services/bd.services");
const enums_1 = require("../../types/enums");
const order_utils_1 = require("../../utils/order.utils");
const supabase_utils_1 = require("../../utils/supabase.utils");
class OrderSiembraModelTestingSupabase {
    constructor(supabase) {
        this.Table = enums_1.ETablas.OrdenSiembra;
        this.MapTable = mappings_1.TablasMap[this.Table].map;
        this.getAll = async () => {
            const tableOrder = enums_1.ETablas.Order;
            const mapTableOrder = mappings_1.TablasMap[tableOrder].map;
            if (mapTableOrder.dateOfCreation == null || mapTableOrder.type == null)
                return [];
            const query = (0, order_utils_1.querySelectOrdenByTypeSupabase)(enums_1.EOrderType.Siembra);
            const { data } = await this.supabase.from(tableOrder).select(query).eq(mapTableOrder.type, enums_1.EOrderType.Siembra).order(mapTableOrder.dateOfCreation);
            if (data == null)
                return [];
            return data.map((row) => {
                const orderDt = bd_services_1.BDService.getObjectFromTable(tableOrder, row, true);
                return order_schema_1.orderSiembraSchema.parse(orderDt);
            });
        };
        this.getById = async (id) => {
            const tableOrder = enums_1.ETablas.Order;
            const mapTableOrder = mappings_1.TablasMap[tableOrder].map;
            if (mapTableOrder.id == null)
                return undefined;
            const query = (0, order_utils_1.querySelectOrdenByTypeSupabase)(enums_1.EOrderType.Siembra);
            const { data } = await this.supabase.from(tableOrder).select(query).eq(mapTableOrder.id, id).single();
            if (data == null)
                return undefined;
            const orderDt = bd_services_1.BDService.getObjectFromTable(tableOrder, data, true);
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
            await this.updateDatosSemillaPorSiembra(datosSiembra.datosSemilla);
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, datosSiembra);
            if (error != null)
                throw new Error('Error al crear la orden de trabajo');
        };
        this.remove = async (_) => { };
        this.removeSiembra = async (orderSiembra) => {
            await this.removeDatosSemillaSiembra(orderSiembra.siembra.datosSemilla.id);
            const mapTable = this.MapTable;
            if (mapTable.id == null)
                return;
            await this.supabase.from(this.Table).delete().eq(mapTable.id, orderSiembra.siembra.id);
        };
        // #region Utils
        // #region Create
        this.createDataSemillaPorSiembra = async (datos) => {
            const tabla = enums_1.ETablas.SemillaPorSiembra;
            const newDatosSemilla = {
                ...datos,
                id: (0, crypto_1.randomUUID)()
            };
            const error = await (0, supabase_utils_1.upsert)(this.supabase, tabla, newDatosSemilla);
            if (error != null)
                throw new Error('Error al insertar los datos de la siembra');
            return newDatosSemilla;
        };
        this.createDataOrdenSiembra = async (datos) => {
            // creo la asociación con la semilla (SemillaXSiembra)
            const semillaXSiembra = await this.createDataSemillaPorSiembra(datos.datosSemilla);
            const newDatosSiembra = {
                ...datos,
                datosSemilla: semillaXSiembra,
                id: (0, crypto_1.randomUUID)()
            };
            const error = await (0, supabase_utils_1.upsert)(this.supabase, this.Table, newDatosSiembra);
            if (error != null)
                throw new Error('Error al insertar la Orden de Trabajo de Siembra');
            return newDatosSiembra;
        };
        // #endregion
        // #region Update
        this.updateDatosSemillaPorSiembra = async (datos) => {
            const error = await (0, supabase_utils_1.upsert)(this.supabase, enums_1.ETablas.SemillaPorSiembra, datos);
            if (error != null)
                throw new Error('Error al actualizar la orden de siembra');
        };
        // #endregion
        // #region Remove
        this.removeDatosSemillaSiembra = async (idDatosSemilla) => {
            const tabla = enums_1.ETablas.SemillaPorSiembra;
            const mapTable = mappings_1.TablasMap[tabla].map;
            if (mapTable.id == null)
                return;
            await this.supabase.from(tabla).delete().eq(mapTable.id, idDatosSemilla);
        };
        this.supabase = supabase;
    }
}
exports.OrderSiembraModelTestingSupabase = OrderSiembraModelTestingSupabase;
