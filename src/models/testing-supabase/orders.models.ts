import { IOrder, ICreateOrder, orderSchema, IOrderBase, IUpdateOrderBase, IUpdateOrder } from '../../schemas/order.schema'
import { IUserPrivate } from '../../schemas/user.schema'
import { IOrderModel } from '../definitions/orders.models'
import { EOrderType, ETablas } from '../../types/enums'
import { BDService } from '../../services/bd.services'
import { TablasMap } from '../../schemas/mappings'
import { ILote } from '../../schemas/lote.schema'
import { randomUUID } from 'crypto'
import { OrderCosechaModelTestingSupabase } from './orderCosecha.models'
import { OrderFertilizacionModelTestingSupabase } from './orderFertilizacion.models'
import { OrderSiembraModelTestingSupabase } from './orderSiembra.models'
import supabase from '../../config/supabase'
import { querySelectOrdenByTypeSupabase } from '../../utils/order.utils'

interface IOrderModels {
  orderSiembraModel: OrderSiembraModelTestingSupabase
  orderCosechaModel: OrderCosechaModelTestingSupabase
  orderFertilizacionModel: OrderFertilizacionModelTestingSupabase
}
export class OrderModelTestingSupabase implements IOrderModel {
  models: IOrderModels
  Table: ETablas = ETablas.Order
  MapTable = TablasMap[this.Table]

  constructor () {
    this.models = {
      orderSiembraModel: new OrderSiembraModelTestingSupabase(),
      orderCosechaModel: new OrderCosechaModelTestingSupabase(),
      orderFertilizacionModel: new OrderFertilizacionModelTestingSupabase()
    }
  }

  getAll = async (): Promise<IOrder[]> => {
    const mapTable = this.MapTable.map
    if (mapTable.dateOfCreation == null || mapTable.type == null) return []

    const query = querySelectOrdenByTypeSupabase()
    const { data } = await supabase.from(this.Table).select(query).order(mapTable.dateOfCreation)
    if (data == null) return []

    return data.map((row) => {
      const orderDt = BDService.getObjectFromTable(ETablas.Order, row, true)
      return orderSchema.parse(orderDt)
    })
  }

  getById = async (id: string): Promise<IOrder | undefined> => {
    const orderSiembra = await this.models.orderSiembraModel.getById(id)
    if (orderSiembra != null) return orderSiembra

    const orderFert = await this.models.orderFertilizacionModel.getById(id)
    if (orderFert != null) return orderFert

    const orderCosecha = await this.models.orderCosechaModel.getById(id)
    if (orderCosecha != null) return orderSiembra

    return undefined
  }

  getByType = async (type: EOrderType): Promise<IOrder[]> => {
    switch (type) {
      case EOrderType.Siembra: return await this.models.orderSiembraModel.getAll()
      case EOrderType.Cosecha: return await this.models.orderCosechaModel.getAll()
      case EOrderType.Fertilizacion: return await this.models.orderFertilizacionModel.getAll()
      default: return []
    }
  }

  create = async (order: ICreateOrder, creator: IUserPrivate, lote: ILote): Promise<IOrder> => {
    const nuevoCodigoOrden = await this.getNewCodeOrder(order.type)
    if (nuevoCodigoOrden === '') throw new Error('Error al crear la orden de trabajo')

    const orderBase: IOrderBase = {
      ...order,
      lote,
      creator,
      codigo: nuevoCodigoOrden,
      dateOfCreation: new Date().toISOString(),
      id: randomUUID()
    }

    const newOrder = await this.createOrderByType(orderBase, order)
    if (newOrder == null) throw new Error('Error al crear la orden de trabajo')

    const error = await BDService.upsert<IOrder>(this.Table, newOrder)
    if (error != null) throw new Error('Error al crear la orden de trabajo')

    return newOrder
  }

  update = async (order: IUpdateOrder): Promise<void> => {
    let orderToUpdate: IUpdateOrderBase | undefined
    if (order.type === EOrderType.Siembra) {
      const { siembra, ...restOfSiembra } = order
      orderToUpdate = restOfSiembra
      await this.models.orderSiembraModel.update(siembra)
    }
    if (order.type === EOrderType.Cosecha) {
      const { cosecha, ...restOfCosecha } = order
      orderToUpdate = restOfCosecha
      await this.models.orderCosechaModel.update(cosecha)
    }
    if (order.type === EOrderType.Fertilizacion) {
      const { fertilizacion, ...restOfFert } = order
      orderToUpdate = restOfFert
      await this.models.orderFertilizacionModel.update(fertilizacion)
    }
    if (orderToUpdate == null) throw new Error('Error al actualizar la orden')

    const error = await BDService.upsert<IUpdateOrderBase>(this.Table, orderToUpdate)
    if (error != null) throw new Error('Error al crear la orden de trabajo')
  }

  remove = async (id: string): Promise<void> => {
    const orderToDelete = await this.getById(id)
    if (orderToDelete == null) return

    await this.removeByType(orderToDelete)

    const mapTable = this.MapTable.map
    if (mapTable.id == null) return

    await supabase.from(this.Table).delete().eq(mapTable.id, id)
  }

  // #region Utils
  // #region CreateOrder
  getNewCodeOrder = async (type: EOrderType): Promise<string> => {
    const { data } = await supabase.rpc('get_new_code_order', { type })
    if (data == null || data.length === 0) throw new Error('Error al definir el codigo')
    return data[0] ?? ''
  }

  createOrderByType = async (orderBase: IOrderBase, order: ICreateOrder): Promise<IOrder | null> => {
    if (order.type === EOrderType.Siembra) return await this.models.orderSiembraModel.create(orderBase, order.siembra)
    if (order.type === EOrderType.Cosecha) return await this.models.orderCosechaModel.create(orderBase, order.cosecha)
    if (order.type === EOrderType.Fertilizacion) return await this.models.orderFertilizacionModel.create(orderBase, order.fertilizacion)

    return null
  }
  // #endregion

  // #region RemoveOrder
  removeByType = async (order: IOrder): Promise<void> => {
    switch (order.type) {
      case EOrderType.Siembra: return await this.models.orderSiembraModel.removeSiembra(order)
      case EOrderType.Cosecha: return await this.models.orderCosechaModel.removeCosecha(order)
      case EOrderType.Fertilizacion: return await this.models.orderFertilizacionModel.removeFertilizacion(order)
    }
  }
  // #endregion

  // #endregion
}
