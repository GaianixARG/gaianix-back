import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { IOrderCosecha, IOrderBase, ICreateDatosCosecha, ICreateOrderCosecha, IDatosCosecha, orderCosechaSchema } from '../../schemas/order.schema'
import { BDService } from '../../services/bd.services'
import { EOrderType, ETablas } from '../../types/enums'
import { IOrderCosechaModel } from '../definitions/orderCosecha.models'
import { TablasMap } from '../../schemas/mappings'
import { querySelectOrdenByType } from '../../utils/order.utils'

const querySelectOrdenCosecha = (): string => {
  return querySelectOrdenByType(EOrderType.Cosecha)
}

export class OrderCosechaModelLocalPostgres implements IOrderCosechaModel {
  getAll = async (): Promise<IOrderCosecha[]> => {
    const table = ETablas.Order
    const mapTable = TablasMap[table].map
    if (mapTable.dateOfCreation == null || mapTable.type == null) return []

    const result = await pool.query(`${querySelectOrdenCosecha()} WHERE ${mapTable.type} = $1 ORDER BY ${mapTable.dateOfCreation} DESC`, [EOrderType.Cosecha])

    return result.rows.map((row) => {
      const orderDt = BDService.getObjectFromTable(table, row)
      return orderCosechaSchema.parse(orderDt)
    })
  }

  getById = async (id: string): Promise<IOrderCosecha | undefined> => {
    const table = ETablas.Order
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${querySelectOrdenCosecha()} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const orderDt = BDService.getObjectFromTable(table, result.rows[0])
    return orderCosechaSchema.parse(orderDt)
  }

  create = async (orderBase: IOrderBase, datosCosecha: ICreateDatosCosecha): Promise<IOrderCosecha> => {
    return {
      ...orderBase,
      type: EOrderType.Cosecha,
      cosecha: await this.createDataOrdenCosecha(datosCosecha)
    }
  }

  update = async (_id: string, _orderCosecha: ICreateOrderCosecha): Promise<void> => {}
  remove = async (orderId: string): Promise<void> => {
    const qOrderCosecha = BDService.queryRemoveByRel(ETablas.OrdenCosecha, ETablas.Order)
    await pool.query(qOrderCosecha, [orderId])

    const qOrder = BDService.queryRemoveById(ETablas.Order)
    await pool.query(qOrder, [orderId])
  }

  createDataOrdenCosecha = async (datos: ICreateDatosCosecha): Promise<IDatosCosecha> => {
    const tabla = ETablas.OrdenCosecha

    const newDatosCosecha: IDatosCosecha = {
      ...datos,
      id: randomUUID()
    }

    const queryInsertDatos = BDService.queryInsert<IDatosCosecha>(tabla, newDatosCosecha)

    const result = await pool.query(queryInsertDatos.query, queryInsertDatos.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al insertar los datos de la cosecha')

    return newDatosCosecha
  }
}
