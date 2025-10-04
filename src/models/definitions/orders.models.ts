import { IOrder, ICreateOrder } from '../../schemas/order.schema'
import { IUserPrivate } from '../../schemas/user.schema'

export interface IOrderModel {
  getAll: () => Promise<IOrder[]>
  getById: (id: string) => Promise<IOrder | undefined>
  create: (order: ICreateOrder, creator: IUserPrivate) => Promise<IOrder>
}
