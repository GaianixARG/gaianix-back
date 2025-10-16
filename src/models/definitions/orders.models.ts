import { ILote } from '../../schemas/lote.schema'
import { IOrder, ICreateOrder } from '../../schemas/order.schema'
import { IUserPrivate } from '../../schemas/user.schema'
import { EOrderType } from '../../types/enums'
import { IOrderCosechaModel } from './orderCosecha.models'
import { IOrderFertilizacionModel } from './orderFertilizacion.models'
import { IOrderSiembraModel } from './orderSiembra.models'

export interface IOrderModels {
  orderSiembraModel: IOrderSiembraModel
  orderCosechaModel: IOrderCosechaModel
  orderFertilizacionModel: IOrderFertilizacionModel
}

export interface IOrderModel {
  models: IOrderModels

  getAll: () => Promise<IOrder[]>
  getById: (id: string) => Promise<IOrder | undefined>
  getByType: (type: EOrderType) => Promise<IOrder[]>
  create: (order: ICreateOrder, creator: IUserPrivate, lote: ILote) => Promise<IOrder>
  update: (id: string, order: ICreateOrder, lote: ILote) => Promise<void>
  remove: (id: string) => Promise<void>
}
