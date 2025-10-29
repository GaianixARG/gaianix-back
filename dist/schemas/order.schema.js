"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerSchemasOrder = exports.createOrderSchema = exports.orderSchema = exports.createOrderCosechaSchema = exports.orderCosechaSchema = exports.createOrderFertilizacionSchema = exports.orderFertilizacionSchema = exports.createOrderSiembraSchema = exports.orderSiembraSchema = exports.DDMMYYYY_REGEX = exports.createOrderBaseSchema = exports.orderBaseSchema = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("./user.schema");
const seed_schema_1 = require("./seed.schema");
const enums_1 = require("../types/enums");
const lote_schema_1 = require("./lote.schema");
const fertilizer_schema_1 = require("./fertilizer.schema");
// Base de Order
const createOmits = {
    id: true,
    dateOfCreation: true,
    codigo: true,
    creator: true
};
const datosOrderBaseSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    codigo: zod_1.z.string(),
    title: zod_1.z.string(),
    type: zod_1.z.enum(enums_1.EOrderType),
    status: zod_1.z.enum(enums_1.EStatus),
    dateOfCreation: zod_1.z.iso.datetime({ offset: true }),
    creator: user_schema_1.userPrivateSchema,
    prioridad: zod_1.z.enum(enums_1.EPrioridad)
});
exports.orderBaseSchema = datosOrderBaseSchema.extend({ lote: lote_schema_1.loteSchema });
exports.createOrderBaseSchema = exports.orderBaseSchema.omit(createOmits).extend({ lote: lote_schema_1.loteSchema.pick({ id: true }) });
exports.DDMMYYYY_REGEX = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/;
// Order Siembra
// #region Semilla
const datosSemillaSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    semilla: seed_schema_1.seedSchema,
    cantidadSemillasHa: zod_1.z.number()
});
const createDatosSemillaSchema = datosSemillaSchema.omit({ id: true });
// #endregion
// #region Siembra
const baseSchemaDatosSiembraSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    // fechaMaxSiembra: z.string().regex(DDMMYYYY_REGEX, 'La fecha debe estar en formato DD/MM/YYYY'),
    fechaMaxSiembra: zod_1.z.iso.datetime({ offset: true }),
    distanciaSiembra: zod_1.z.number(),
    cantidadHectareas: zod_1.z.number(),
    fertilizante: fertilizer_schema_1.fertilizerSchema.nullable()
});
const datosSiembraSchema = baseSchemaDatosSiembraSchema.extend({
    datosSemilla: datosSemillaSchema
});
const createDatosSiembraSchema = baseSchemaDatosSiembraSchema.omit({ id: true }).extend({
    datosSemilla: createDatosSemillaSchema
});
// #endregion
// #region OrderSiembra
exports.orderSiembraSchema = exports.orderBaseSchema.extend({
    type: zod_1.z.literal(enums_1.EOrderType.Siembra),
    siembra: datosSiembraSchema
});
exports.createOrderSiembraSchema = exports.createOrderBaseSchema.extend({
    type: zod_1.z.literal(enums_1.EOrderType.Siembra),
    siembra: createDatosSiembraSchema
});
// #endregion
// Order Fertilización
const datosFertilizacionSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    fertilizante: fertilizer_schema_1.fertilizerSchema,
    dosisKgHa: zod_1.z.number(),
    metodo: zod_1.z.string()
});
const createDatosFertilizacionSchema = datosFertilizacionSchema.omit({ id: true });
exports.orderFertilizacionSchema = exports.orderBaseSchema.extend({
    type: zod_1.z.literal(enums_1.EOrderType.Fertilizacion),
    fertilizacion: datosFertilizacionSchema
});
exports.createOrderFertilizacionSchema = exports.createOrderBaseSchema.extend({
    type: zod_1.z.literal(enums_1.EOrderType.Fertilizacion),
    fertilizacion: createDatosFertilizacionSchema
});
// Order Cosecha
const datosCosechaSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    fechaCosecha: zod_1.z.iso.datetime({ offset: true }),
    rendimientoEstimado: zod_1.z.number(),
    maquinaria: zod_1.z.string(),
    humedad: zod_1.z.number()
});
const createDatosCosechaSchema = datosCosechaSchema.omit({ id: true });
exports.orderCosechaSchema = exports.orderBaseSchema.extend({
    type: zod_1.z.literal(enums_1.EOrderType.Cosecha),
    cosecha: datosCosechaSchema
});
exports.createOrderCosechaSchema = exports.createOrderBaseSchema.extend({
    type: zod_1.z.literal(enums_1.EOrderType.Cosecha),
    cosecha: createDatosCosechaSchema
});
// Unión de Orders
exports.orderSchema = zod_1.z.discriminatedUnion('type', [
    exports.orderSiembraSchema,
    exports.orderFertilizacionSchema,
    exports.orderCosechaSchema
]);
exports.createOrderSchema = zod_1.z.discriminatedUnion('type', [
    exports.createOrderSiembraSchema,
    exports.createOrderFertilizacionSchema,
    exports.createOrderCosechaSchema
]);
// Swagger
exports.SwaggerSchemasOrder = {
    Order: zod_1.z.toJSONSchema(exports.orderSchema),
    OrderCreate: zod_1.z.toJSONSchema(exports.createOrderSchema)
};
