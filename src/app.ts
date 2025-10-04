import express from 'express'
import { config } from './config/env'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import { createOrderRouter } from './routes/orders.routes'
import { createSeedRouter } from './routes/seeds.routes'
import { createUserRouter } from './routes/users.routes'
import { setupSwagger } from './config/swagger'
import { IOrderModel } from './models/definitions/orders.models'
import { IUserModel } from './models/definitions/users.models'
import { ISeedModel } from './models/definitions/seeds.models'

export interface AppModels {
  orderModel: IOrderModel
  userModel: IUserModel
  seedModel: ISeedModel
}

export const createApp = ({ orderModel, userModel, seedModel }: AppModels): void => {
  const app = express()
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))
  app.use(express.json())
  app.use(cookieParser())

  app.use('/api/orders', createOrderRouter({ userModel, orderModel }))
  app.use('/api/seeds', createSeedRouter({ seedModel }))
  app.use('/api/user', createUserRouter({ userModel }))

  const port = config.port

  setupSwagger(app)

  app.listen(port, () => {
    console.log(`🚀 Gaianix backend running on http://localhost:${port}`)
    console.log(`📑 Swagger docs: http://localhost:${config.port}/api/docs`)
  })
}
