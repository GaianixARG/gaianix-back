import { z } from 'zod'
import { userPrivateSchema } from './user.schema'
import { seedSchema } from './seed.schema'
import { EMetodoFertilizacion, EOrderType, EPrioridad, EStatus } from '../types/enums'
import { loteSchema } from './lote.schema'
import { fertilizerSchema } from './fertilizer.schema'

// Base de Order
const createOmits = {
  id: true,
  dateOfCreation: true,
  codigo: true,
  creator: true
} as const

const datosOrderBaseSchema = z.object({
  id: z.uuid(),
  codigo: z.string(),
  title: z.string(),
  type: z.enum(EOrderType),
  status: z.enum(EStatus),
  dateOfCreation: z.iso.datetime({ offset: true }),
  creator: userPrivateSchema,
  prioridad: z.enum(EPrioridad)
})

export const orderBaseSchema = datosOrderBaseSchema.extend({ lote: loteSchema })

export const createOrderBaseSchema = orderBaseSchema.omit(createOmits).extend({ lote: loteSchema.pick({ id: true }) })

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
  fechaMaxSiembra: z.iso.datetime({ offset: true }),
  distanciaSiembra: z.number(),
  cantidadHectareas: z.number(),
  fertilizante: fertilizerSchema.nullable()
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

export const createOrderSiembraSchema = createOrderBaseSchema.extend({
  type: z.literal(EOrderType.Siembra),
  siembra: createDatosSiembraSchema
})
// #endregion

// Order Fertilización
const datosFertilizacionSchema = z.object({
  id: z.uuid(),
  fertilizante: fertilizerSchema,
  dosisKgHa: z.number(),
  metodo: z.enum(EMetodoFertilizacion)
})

const createDatosFertilizacionSchema = datosFertilizacionSchema.omit({ id: true })

export const orderFertilizacionSchema = orderBaseSchema.extend({
  type: z.literal(EOrderType.Fertilizacion),
  fertilizacion: datosFertilizacionSchema
})

export const createOrderFertilizacionSchema = createOrderBaseSchema.extend({
  type: z.literal(EOrderType.Fertilizacion),
  fertilizacion: createDatosFertilizacionSchema
})

// Order Cosecha
const datosCosechaSchema = z.object({
  id: z.uuid(),
  fechaCosecha: z.iso.datetime({ offset: true }),
  rendimientoEstimado: z.number(),
  maquinaria: z.string(),
  humedad: z.number()
})

const createDatosCosechaSchema = datosCosechaSchema.omit({ id: true })

export const orderCosechaSchema = orderBaseSchema.extend({
  type: z.literal(EOrderType.Cosecha),
  cosecha: datosCosechaSchema
})

export const createOrderCosechaSchema = createOrderBaseSchema.extend({
  type: z.literal(EOrderType.Cosecha),
  cosecha: createDatosCosechaSchema
})

// Unión de Orders
export const orderSchema = z.discriminatedUnion('type', [
  orderSiembraSchema,
  orderFertilizacionSchema,
  orderCosechaSchema
])

export const orderUdpateStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(EStatus)
})

export const createOrderSchema = z.discriminatedUnion('type', [
  createOrderSiembraSchema,
  createOrderFertilizacionSchema,
  createOrderCosechaSchema
])

// Interferimos las interfaces
export type MyOmit<T, K extends PropertyKey> =
    { [P in keyof T as Exclude<P, K>]: T[P] }

// Ordenes
export type KeysOmitUpdateOrder = 'dateOfCreation' | 'codigo' | 'creator'

export type IOrderBase = z.infer<typeof orderBaseSchema>
export type ICreateOrderBase = z.infer<typeof createOrderBaseSchema>
export type IUpdateOrderBase = Omit<IOrderBase, KeysOmitUpdateOrder>

export type IOrder = z.infer<typeof orderSchema>
export type ICreateOrder = z.infer<typeof createOrderSchema>
export type IUpdateOrder = MyOmit<IOrder, KeysOmitUpdateOrder>
export type IUpdateStatusOrder = z.infer<typeof orderUdpateStatusSchema>

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
