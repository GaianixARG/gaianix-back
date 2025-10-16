import { createApp } from './app'
import { FertilizerModelLocalPostgres } from './models/localhost-postgres/fertilizer.models'
import { LoteModelLocalPostgres } from './models/localhost-postgres/lote.models'
import { OrderCosechaModelLocalPostgres } from './models/localhost-postgres/orderCosecha.models'
import { OrderFertilizacionModelLocalPostgres } from './models/localhost-postgres/orderFertilizacion.models'
import { OrderModelLocalPostgres } from './models/localhost-postgres/orders.models'
import { OrderSiembraModelLocalPostgres } from './models/localhost-postgres/orderSiembra.models'
import { SeedModelLocalPostgres } from './models/localhost-postgres/seeds.models'
import { UserModelLocalPostgres } from './models/localhost-postgres/users.models'

const orderSiembraModel = new OrderSiembraModelLocalPostgres()
const orderFertilizacionModel = new OrderFertilizacionModelLocalPostgres()
const orderCosechaModel = new OrderCosechaModelLocalPostgres()

createApp({
  orderModel: new OrderModelLocalPostgres({
    orderSiembraModel,
    orderFertilizacionModel,
    orderCosechaModel
  }),
  seedModel: new SeedModelLocalPostgres(),
  userModel: new UserModelLocalPostgres(),
  loteModel: new LoteModelLocalPostgres(),
  fertilizerModel: new FertilizerModelLocalPostgres()
})
