
import { z } from 'zod'

// Fertilizante
export const fertilizerSchema = z.object({
  id: z.uuid(),
  name: z.string()
})

export const createFertilizerSchema = fertilizerSchema.omit({ id: true })

// Interfaces
export type IFertilizer = z.infer<typeof fertilizerSchema>
export type ICreateFertilizer = z.infer<typeof createFertilizerSchema>

// Swagger
export const SwaggerSchemasSeed = {
  Fertilizer: z.toJSONSchema(fertilizerSchema),
  FertilizerCreate: z.toJSONSchema(createFertilizerSchema)
}
