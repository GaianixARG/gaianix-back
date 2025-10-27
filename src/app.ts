import express from 'express'
import { config } from './config/env'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import { createOrderRouter } from './routes/orders.routes'
import { createSeedRouter } from './routes/seeds.routes'
import { createUserRouter } from './routes/users.routes'
import { createLotesRouter } from './routes/lotes.routes'
import { setupSwagger } from './config/swagger'
import { IOrderModel } from './models/definitions/orders.models'
import { IUserModel } from './models/definitions/users.models'
import { ISeedModel } from './models/definitions/seeds.models'
import { ILoteModel } from './models/definitions/lote.models'
import { IFertilizerModel } from './models/definitions/fertilizer.models'
import { createFertilizerRouter } from './routes/fertilizer.routes'

export interface AppModels {
  orderModel: IOrderModel
  userModel: IUserModel
  seedModel: ISeedModel
  loteModel: ILoteModel
  fertilizerModel: IFertilizerModel
}

export const createApp = ({ orderModel, userModel, seedModel, loteModel, fertilizerModel }: AppModels): express.Express => {
  const app = express()
  app.use(cors({
    origin: '*',
    credentials: true
  }))
  app.use(express.json())
  app.use(cookieParser())

  app.use('/api/orders', createOrderRouter({ userModel, orderModel, loteModel }))
  app.use('/api/seeds', createSeedRouter({ seedModel }))
  app.use('/api/users', createUserRouter({ userModel }))
  app.use('/api/lotes', createLotesRouter({ loteModel }))
  app.use('/api/fertilizers', createFertilizerRouter({ fertilizerModel }))

  const port = config.port

  setupSwagger(app)

  app.listen(port, () => {
    console.log(`🚀 Gaianix backend running on http://localhost:${port}`)
    console.log(`📑 Swagger docs: http://localhost:${config.port}/api/docs`)
  })

  return app
}
