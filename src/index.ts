import { createApp } from './app'
import { OrderModelLocalPostgres } from './models/localhost-postgres/orders.models'
import { SeedModelLocalPostgres } from './models/localhost-postgres/seeds.models'
import { UserModelLocalPostgres } from './models/localhost-postgres/users.models'

createApp({
  orderModel: new OrderModelLocalPostgres(),
  seedModel: new SeedModelLocalPostgres(),
  userModel: new UserModelLocalPostgres()
})
