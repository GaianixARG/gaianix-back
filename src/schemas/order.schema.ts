import { z } from 'zod'
import { userPrivateSchema } from './user.schema'
import { seedSchema } from './seed.schema'
import { EOrderType, EPrioridad, EStatus } from '../types/enums'

// Base de Order
export const orderBaseSchema = z.object({
  id: z.uuid(),
  codigo: z.string(),
  title: z.string(),
  type: z.enum(EOrderType),
  status: z.enum(EStatus),
  lote: z.string(),
  dateOfCreation: z.iso.datetime(),
  creator: userPrivateSchema,
  prioridad: z.enum(EPrioridad)
})

export const DDMMYYYY_REGEX = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/

// Order Siembra
// #region Semilla
const datosSemillaSchema = z.object({
  id: z.uuid(),
  semilla: seedSchema,
  cantidadSemillasHa: z.number()
})

const createDatosSemillaSchema = datosSemillaSchema.omit({ id: true })
// #endregion

// #region Siembra
const baseSchemaDatosSiembraSchema = z.object({
  id: z.uuid(),
  // fechaMaxSiembra: z.string().regex(DDMMYYYY_REGEX, 'La fecha debe estar en formato DD/MM/YYYY'),
  fechaMaxSiembra: z.iso.datetime(),
  distanciaSiembra: z.number()
})

const datosSiembraSchema = baseSchemaDatosSiembraSchema.extend({
  datosSemilla: datosSemillaSchema
})

const createDatosSiembraSchema = baseSchemaDatosSiembraSchema.omit({ id: true }).extend({
  datosSemilla: createDatosSemillaSchema
})
// #endregion

// #region OrderSiembra
export const orderSiembraSchema = orderBaseSchema.extend({
  type: z.literal(EOrderType.Siembra),
  siembra: datosSiembraSchema
})

export const createOrderSiembraSchema = orderBaseSchema.extend({
  type: z.literal(EOrderType.Siembra),
  siembra: createDatosSiembraSchema
})
// #endregion

// Order Fertilización
const datosFertilizacionSchema = z.object({
  id: z.uuid(),
  fertilizante: z.string(),
  dosisKgHa: z.number(),
  metodo: z.string()
})

const createDatosFertilizacionSchema = datosFertilizacionSchema.omit({ id: true })

export const orderFertilizacionSchema = orderBaseSchema.extend({
  type: z.literal(EOrderType.Fertilizacion),
  fertilizacion: datosFertilizacionSchema
})

export const createOrderFertilizacionSchema = orderBaseSchema.extend({
  type: z.literal(EOrderType.Fertilizacion),
  fertilizacion: createDatosFertilizacionSchema
})

// Order Cosecha
const datosCosechaSchema = z.object({
  id: z.uuid(),
  fechaCosecha: z.iso.date(),
  rendimientoEstimado: z.number(),
  maquinaria: z.string(),
  humedad: z.number()
})

const createDatosCosechaSchema = datosCosechaSchema.omit({ id: true })

export const orderCosechaSchema = orderBaseSchema.extend({
  type: z.literal(EOrderType.Cosecha),
  cosecha: datosCosechaSchema
})

export const createOrderCosechaSchema = orderBaseSchema.extend({
  type: z.literal(EOrderType.Cosecha),
  cosecha: createDatosCosechaSchema
})

// Unión de Orders
export const orderSchema = z.discriminatedUnion('type', [
  orderSiembraSchema,
  orderFertilizacionSchema,
  orderCosechaSchema
])

const createOmits = {
  id: true,
  dateOfCreation: true,
  codigo: true,
  creator: true
} as const

export const createOrderSchema = z.discriminatedUnion('type', [
  createOrderSiembraSchema.omit(createOmits),
  createOrderFertilizacionSchema.omit(createOmits),
  createOrderCosechaSchema.omit(createOmits)
])

// Interferimos las interfaces
export type IOrderBase = z.infer<typeof orderBaseSchema>
export type IOrder = z.infer<typeof orderSchema>
export type ICreateOrder = z.infer<typeof createOrderSchema>

// Siembra
export type IDatosSemilla = z.infer<typeof datosSemillaSchema>
export type ICreateDatosSemilla = z.infer<typeof createDatosSemillaSchema>

export type IDatosSiembra = z.infer<typeof datosSiembraSchema>
export type ICreateDatosSiembra = z.infer<typeof createDatosSiembraSchema>

export type IOrderSiembra = z.infer<typeof orderSiembraSchema>
export type ICreateOrderSiembra = z.infer<typeof createOrderSiembraSchema>

// Cosecha
export type IDatosCosecha = z.infer<typeof datosCosechaSchema>
export type ICreateDatosCosecha = z.infer<typeof createDatosCosechaSchema>

export type IOrderCosecha = z.infer<typeof orderCosechaSchema>
export type ICreateOrderCosecha = z.infer<typeof createOrderCosechaSchema>

// Fertilización
export type IDatosFertilizacion = z.infer<typeof datosFertilizacionSchema>
export type ICreateDatosFertilizacion = z.infer<typeof createDatosFertilizacionSchema>

export type IOrderFertilizacion = z.infer<typeof orderFertilizacionSchema>
export type ICreateOrderFertilizacion = z.infer<typeof createOrderFertilizacionSchema>

// Swagger
export const SwaggerSchemasOrder = {
  Order: z.toJSONSchema(orderSchema),
  OrderCreate: z.toJSONSchema(createOrderSchema)
}
