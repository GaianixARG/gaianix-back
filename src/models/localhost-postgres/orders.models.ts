import { IOrder, ICreateOrder, orderSchema, IOrderBase, IUpdateOrder, IUpdateOrderBase } from '../../schemas/order.schema'
import { IUserPrivate } from '../../schemas/user.schema'
import pool from '../../config/db'
import { IOrderModel } from '../definitions/orders.models'
import { EOrderType, ETablas } from '../../types/enums'
import { BDService } from '../../services/bd.services'
import { TablasMap } from '../../schemas/mappings'
import { ILote } from '../../schemas/lote.schema'
import { randomUUID } from 'crypto'
import { queryGetNewCode, querySelectOrdenByType } from '../../utils/order.utils'
import { OrderSiembraModelLocalPostgres } from './orderSiembra.models'
import { OrderCosechaModelLocalPostgres } from './orderCosecha.models'
import { OrderFertilizacionModelLocalPostgres } from './orderFertilizacion.models'

interface IOrderModels {
  orderSiembraModel: OrderSiembraModelLocalPostgres
  orderCosechaModel: OrderCosechaModelLocalPostgres
  orderFertilizacionModel: OrderFertilizacionModelLocalPostgres
}
export class OrderModelLocalPostgres implements IOrderModel {
  models: IOrderModels

  constructor () {
    this.models = {
      orderSiembraModel: new OrderSiembraModelLocalPostgres(),
      orderCosechaModel: new OrderCosechaModelLocalPostgres(),
      orderFertilizacionModel: new OrderFertilizacionModelLocalPostgres()
    }
  }

  getAll = async (): Promise<IOrder[]> => {
    const mapTable = TablasMap[ETablas.Order].map
    if (mapTable.dateOfCreation == null) return []
    const result = await pool.query(`${querySelectOrdenByType()} ORDER BY ${mapTable.dateOfCreation} DESC`)

    return result.rows.map((row) => {
      const orderDt = BDService.getObjectFromTable(ETablas.Order, row)
      return orderSchema.parse(orderDt)
    })
  }

  getById = async (id: string): Promise<IOrder | undefined> => {
    const table = ETablas.Order
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${querySelectOrdenByType()} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const orderDt = BDService.getObjectFromTable(table, result.rows[0])
    return orderSchema.parse(orderDt)
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

    const queryInsertOdt = BDService.queryInsert<IOrder>(ETablas.Order, newOrder)
    const result = await pool.query(queryInsertOdt.query, queryInsertOdt.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al crear la orden de trabajo')

    return newOrder
  }

  update = async (order: IUpdateOrder): Promise<void> => {
    const { ...restOfOrder } = order

    let orderToUpdate: IUpdateOrderBase | undefined
    if (restOfOrder.type === EOrderType.Siembra) {
      const { siembra, ...restOfSiembra } = restOfOrder
      orderToUpdate = restOfSiembra
      await this.models.orderSiembraModel.update(siembra)
    }
    if (restOfOrder.type === EOrderType.Cosecha) {
      const { cosecha, ...restOfCosecha } = restOfOrder
      orderToUpdate = restOfCosecha
      await this.models.orderCosechaModel.update(cosecha)
    }
    if (restOfOrder.type === EOrderType.Fertilizacion) {
      const { fertilizacion, ...restOfFert } = restOfOrder
      orderToUpdate = restOfFert
      await this.models.orderFertilizacionModel.update(fertilizacion)
    }
    if (orderToUpdate == null) throw new Error('Error al actualizar la orden')

    const { id, ...toUpdate } = orderToUpdate
    const datosUpdate = BDService.queryUpdate<Omit<IUpdateOrderBase, 'id'>>(ETablas.Order, toUpdate, true)
    const result = await pool.query(datosUpdate.query, [...datosUpdate.values, id])
    if (result == null || result.rowCount === 0) throw new Error('Error al actualizar el fertilizante')
  }

  remove = async (id: string): Promise<void> => {
    await this.removeByType(id)

    const query = BDService.queryRemoveById(ETablas.Order)
    await pool.query(query, [id])
  }

  // #region Utils
  // #region CreateOrder
  getNewCodeOrder = async (type: EOrderType): Promise<string> => {
    const result = await pool.query(queryGetNewCode(type))
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al definir el codigo')
    return result.rows[0]?.codigo ?? ''
  }

  createOrderByType = async (orderBase: IOrderBase, order: ICreateOrder): Promise<IOrder | null> => {
    if (order.type === EOrderType.Siembra) return await this.models.orderSiembraModel.create(orderBase, order.siembra)
    if (order.type === EOrderType.Cosecha) return await this.models.orderCosechaModel.create(orderBase, order.cosecha)
    if (order.type === EOrderType.Fertilizacion) return await this.models.orderFertilizacionModel.create(orderBase, order.fertilizacion)

    return null
  }
  // #endregion

  // #region RemoveOrder
  removeByType = async (orderId: string): Promise<void> => {
    await this.models.orderSiembraModel.remove(orderId)
    await this.models.orderFertilizacionModel.remove(orderId)
    await this.models.orderCosechaModel.remove(orderId)
  }
  // #endregion

  // #endregion
}
