import z from 'zod'
import { campoSchema } from './campo.schema'
import { ETipoPoligono } from '../types/enums'

// COORDENADA PARA EL POLIGONO DEL LOTE
export const coordenadaSchema = z.object({
  id: z.uuid(),
  lat: z.number(),
  lon: z.number()
})
export const createCoordenadaSchema = coordenadaSchema.omit({ id: true })

// POLIGONO SCHEMA
export const poligonoBaseSchema = z.object({
  id: z.uuid(),
  color: z.string(),
  type: z.enum(ETipoPoligono),
  radius: z.number().default(0)
})

export const poligonoSchema = poligonoBaseSchema.extend({
  coordenadas: z.array(coordenadaSchema).default([])
})

export const createPoligonoLoteSchema = poligonoBaseSchema.extend({
  coordenadas: z.array(createCoordenadaSchema).default([])
}).omit({ id: true })

// COORDENADA POLIGONO (RELACIONADO)
export const coordPoligonoSchema = coordenadaSchema.extend({
  poligono: poligonoSchema
})
export const createCoordPoligonoLoteSchema = coordPoligonoSchema.omit({ id: true })

export const loteSchema = z.object({
  id: z.uuid(),
  codigo: z.string(),
  campo: campoSchema,
  poligono: poligonoSchema
})
export const createLoteSchema = z.object({
  codigo: z.string(),
  campo: campoSchema,
  poligono: createPoligonoLoteSchema
})

export type ILote = z.infer<typeof loteSchema>
export type ICreateLote = z.infer<typeof createLoteSchema>

export type ICoordenada = z.infer<typeof coordenadaSchema>
export type ICreateCoordenada = z.infer<typeof createCoordenadaSchema>

export type ICoordenadaPoligono = z.infer<typeof coordPoligonoSchema>
export type ICreateCoordenadaPoligono = z.infer<typeof createCoordPoligonoLoteSchema>

export type IPoligonoLote = z.infer<typeof poligonoSchema>
export type ICreatePoligonoLote = z.infer<typeof createPoligonoLoteSchema>
