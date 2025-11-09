import { IOrder, ICreateOrder, IOrderBase, IUpdateOrder } from '../../schemas/order.schema'
import ordersData from '../../data/orders.json'
import { IUserPrivate } from '../../schemas/user.schema'
import { IOrderModel } from '../definitions/orders.models'
import { EOrderType, EStatus } from '../../types/enums'

const orders: IOrder[] = ordersData as IOrder[]

export class OrderModelFileSystem implements IOrderModel {
  updateStatus = async (orderId: string, newStatus: EStatus): Promise<void> => {
    const idx = orders.findIndex(x => x.id === orderId)
    if (idx === -1) return
    orders[idx].status = newStatus
  }

  update = async (order: IUpdateOrder): Promise<void> => {
    const idx = orders.findIndex(x => x.id === order.id)
    if (idx === -1) return
    const antOrd = orders[idx]
    orders[idx] = {
      ...antOrd,
      ...order
    }
  }

  remove = async (id: string): Promise<void> => {
    orders.filter(x => x.id !== id)
  }

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
      lote: {
        id: order.lote.id,
        codigo: '',
        campo: {
          id: '1',
          nombre: ''
        }
      },
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
          datosSemilla,
          cantidadHectareas: 0,
          fertilizante: null
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
