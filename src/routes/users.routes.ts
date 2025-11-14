import { Router } from 'express'
import { IUserController, UserController } from '../controllers/user.controller'
import { validateBody } from '../middlewares/validateBody'
import { createUserSchema, loginSchema } from '../schemas/user.schema'
import { authenticateJWT } from '../middlewares/auth'

export const createUserRouter = (models: IUserController): Router => {
  const userRouter = Router()

  const userController = new UserController(models)

  userRouter.post('/auth', authenticateJWT, userController.refreshAuth)
  userRouter.post('/login', validateBody(loginSchema), userController.login)
  userRouter.post('/logout', userController.logout)
  userRouter.post('/', authenticateJWT, validateBody(createUserSchema), userController.create)
  userRouter.get('/me', authenticateJWT, userController.me)

  return userRouter
}
