import z from 'zod'

export const campoSchema = z.object({
  id: z.uuid().or(z.literal('')),
  nombre: z.string()
})

export type ICampo = z.infer<typeof campoSchema>
