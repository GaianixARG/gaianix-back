import { createApp } from './app'
import { FertilizerModelLocalPostgres } from './models/localhost-postgres/fertilizer.models'
import { LoteModelLocalPostgres } from './models/localhost-postgres/lote.models'
import { OrderModelLocalPostgres } from './models/localhost-postgres/orders.models'
import { SeedModelLocalPostgres } from './models/localhost-postgres/seeds.models'
import { UserModelLocalPostgres } from './models/localhost-postgres/users.models'

export const appLocal = createApp({
  orderModel: new OrderModelLocalPostgres(),
  seedModel: new SeedModelLocalPostgres(),
  userModel: new UserModelLocalPostgres(),
  loteModel: new LoteModelLocalPostgres(),
  fertilizerModel: new FertilizerModelLocalPostgres()
})
