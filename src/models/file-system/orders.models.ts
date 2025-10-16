import { IOrder, ICreateOrder, IOrderBase } from '../../schemas/order.schema'
import ordersData from '../../data/orders.json'
import { IUserPrivate } from '../../schemas/user.schema'
import { IOrderModel } from '../definitions/orders.models'
import { EOrderType } from '../../types/enums'

const orders: IOrder[] = ordersData as IOrder[]

export class OrderModelFileSystem implements IOrderModel {
  getAll = async (): Promise<IOrder[]> => orders
  getById = async (id: string): Promise<IOrder | undefined> => orders.find(x => x.id === id)
  getByType = async (type: EOrderType): Promise<IOrder[]> => orders.filter(x => x.type === type)
  create = async (order: ICreateOrder, creator: IUserPrivate): Promise<IOrder> => {
    const typeOrder = order.type.charAt(0)
    const maxCode = Math.max(...orders.map(x => +x.codigo.slice(1)))

    const newOrderBase: IOrderBase = {
      id: 'asdasd',
      codigo: `${typeOrder}${maxCode.toString().padStart(4, '0')}`,
      creator,
      dateOfCreation: 'string',
      title: order.title,
      type: EOrderType.Siembra,
      status: order.status,
      lote: order.lote,
      prioridad: order.prioridad
    }
    let newOrder: IOrder | undefined
    if (newOrderBase.type === EOrderType.Siembra && order.type === EOrderType.Siembra) {
      const datosSemilla = {
        ...order.siembra.datosSemilla,
        id: '10'
      }

      newOrder = {
        ...newOrderBase,
        id: '10',
        type: newOrderBase.type,
        siembra: {
          id: '10',
          fechaMaxSiembra: order.siembra.fechaMaxSiembra,
          distanciaSiembra: order.siembra.distanciaSiembra,
          datosSemilla
        }
      }
    }
    if (newOrderBase.type === EOrderType.Cosecha && order.type === EOrderType.Cosecha) {
      newOrder = {
        ...newOrderBase,
        type: newOrderBase.type,
        cosecha: {
          ...order.cosecha,
          id: '11'
        }
      }
    }

    if (newOrderBase.type === EOrderType.Fertilizacion && order.type === EOrderType.Fertilizacion) {
      newOrder = {
        ...newOrderBase,
        type: newOrderBase.type,
        fertilizacion: {
          ...order.fertilizacion,
          id: '11'
        }
      }
    }

    if (newOrder == null) throw new Error('Error al crear la orden de trabajo')

    orders.push(newOrder)
    return newOrder
  }
}
