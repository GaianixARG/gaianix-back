import { z } from 'zod'

export const roleSchema = z.object({
  id: z.uuid(),
  name: z.string()
})

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  username: z.string(),
  password: z.string(),
  role: roleSchema
})

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
})

export const userPrivateSchema = userSchema.omit({ password: true })
export const createUserSchema = userSchema.omit({ id: true })

export type ILoginUser = z.infer<typeof loginSchema>
export type IUser = z.infer<typeof userSchema>
export type IUserPrivate = z.infer<typeof userPrivateSchema>
export type ICreateUser = z.infer<typeof createUserSchema>

export type IRol = z.infer<typeof roleSchema>
