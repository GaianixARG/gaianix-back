import z from 'zod'
import { campoSchema } from './campo.schema'

export const loteSchema = z.object({
  id: z.uuid(),
  codigo: z.string(),
  campo: campoSchema
})

export type ILote = z.infer<typeof loteSchema>
