import z from 'zod'

export const campoSchema = z.object({
  id: z.uuid(),
  nombre: z.string()
})

export type ICampo = z.infer<typeof campoSchema>
