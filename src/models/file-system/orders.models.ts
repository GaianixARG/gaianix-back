import { IOrder, ICreateOrder } from '../../schemas/order.schema'
import ordersData from '../../data/orders.json'
import { IUserPrivate } from '../../schemas/user.schema'
import { IOrderModel } from '../definitions/orders.models'

const orders: IOrder[] = ordersData as IOrder[]

export class OrderModelFileSystem implements IOrderModel {
  getAll = async (): Promise<IOrder[]> => orders
  getById = async (id: string): Promise<IOrder | undefined> => orders.find(x => x.id === id)
  create = async (order: ICreateOrder, creator: IUserPrivate): Promise<IOrder> => {
    const typeOrder = order.type.charAt(0)
    const maxCode = Math.max(...orders.map(x => +x.codigo.slice(1)))

    const newOrder = {
      id: 'asdasd',
      codigo: `${typeOrder}${maxCode.toString().padStart(4, '0')}`,
      creator,
      dateOfCreation: 'string',
      ...order
    }
    orders.push(newOrder)
    return newOrder
  }
}
