import { IOrder, ICreateOrder, orderSchema, IOrderBase } from '../../schemas/order.schema'
import { IUserPrivate } from '../../schemas/user.schema'
import pool from '../../config/db'
import { IOrderModel, IOrderModels } from '../definitions/orders.models'
import { EOrderType, ETablas } from '../../types/enums'
import { BDService } from '../../services/bd.services'
import { TablasMap } from '../../schemas/mappings'
import { ILote } from '../../schemas/lote.schema'
import { randomUUID } from 'crypto'
import { queryGetNewCode, querySelectOrdenByType } from '../../utils/order.utils'

export class OrderModelLocalPostgres implements IOrderModel {
  models: IOrderModels

  constructor (models: IOrderModels) {
    this.models = models
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
    if (nuevoCodigoOrden == null) throw new Error('Error al crear la orden de trabajo')

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

  update = async (_id: string, _order: ICreateOrder, _lote: ILote): Promise<void> => {

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

  // #region UpdateOrder
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
