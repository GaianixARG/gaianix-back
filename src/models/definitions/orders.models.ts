import { ILote } from '../../schemas/lote.schema'
import { IOrder, ICreateOrder, IUpdateOrder } from '../../schemas/order.schema'
import { IUserPrivate } from '../../schemas/user.schema'
import { EOrderType } from '../../types/enums'

export interface IOrderModel {
  getAll: () => Promise<IOrder[]>
  getById: (id: string) => Promise<IOrder | undefined>
  getByType: (type: EOrderType) => Promise<IOrder[]>
  create: (order: ICreateOrder, creator: IUserPrivate, lote: ILote) => Promise<IOrder>
  update: (id: string, order: IUpdateOrder) => Promise<void>
  remove: (id: string) => Promise<void>
}
