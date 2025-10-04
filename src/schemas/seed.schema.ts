
import { z } from 'zod'
import { ESeed } from '../types/enums'

// Seed
export const seedSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.enum(ESeed)
})

export const createSeedSchema = seedSchema.omit({ id: true })

// Interfaces
export type ISeed = z.infer<typeof seedSchema>
export type ICreateSeed = z.infer<typeof createSeedSchema>

// Swagger
export const SwaggerSchemasSeed = {
  Seed: z.toJSONSchema(seedSchema),
  SeedCreate: z.toJSONSchema(createSeedSchema)
}
