import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { TablasMap } from '../../schemas/mappings'
import { IOrderFertilizacion, IOrderBase, ICreateDatosFertilizacion, orderFertilizacionSchema, IDatosFertilizacion } from '../../schemas/order.schema'
import { BDService } from '../../services/bd.services'
import { EOrderType, ETablas } from '../../types/enums'
import { IOrderFertilizacionModel } from '../definitions/orderFertilizacion.models'
import { querySelectOrdenByType } from '../../utils/order.utils'

const querySelectOrdenFertilizacion = (): string => {
  return querySelectOrdenByType(EOrderType.Fertilizacion)
}

export class OrderFertilizacionModelLocalPostgres implements IOrderFertilizacionModel {
  getAll = async (): Promise<IOrderFertilizacion[]> => {
    const table = ETablas.Order
    const mapTable = TablasMap[table].map
    if (mapTable.dateOfCreation == null || mapTable.type == null) return []

    const result = await pool.query(`${querySelectOrdenFertilizacion()} WHERE ${mapTable.type} = $1 ORDER BY ${mapTable.dateOfCreation} DESC`, [EOrderType.Fertilizacion])

    return result.rows.map((row) => {
      const orderDt = BDService.getObjectFromTable(table, row)
      return orderFertilizacionSchema.parse(orderDt)
    })
  }

  getById = async (id: string): Promise<IOrderFertilizacion | undefined> => {
    const table = ETablas.Order
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${querySelectOrdenFertilizacion()} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const orderDt = BDService.getObjectFromTable(table, result.rows[0])
    return orderFertilizacionSchema.parse(orderDt)
  }

  create = async (orderBase: IOrderBase, datosFertilizacion: ICreateDatosFertilizacion): Promise<IOrderFertilizacion> => {
    return {
      ...orderBase,
      type: EOrderType.Fertilizacion,
      fertilizacion: await this.createDataOrdenFertilizacion(datosFertilizacion)
    }
  }

  update = async (datosFertilizacion: IDatosFertilizacion): Promise<void> => {
    const { id, ...restOfFert } = datosFertilizacion

    const datosUpdate = BDService.queryUpdate<ICreateDatosFertilizacion>(ETablas.OrdenFertilizacion, restOfFert, true)
    const result = await pool.query(datosUpdate.query, [...datosUpdate.values, id])
    if (result == null || result.rowCount === 0) throw new Error('Error al actualizar la orden de fertilizacion')
  }

  remove = async (orderId: string): Promise<void> => {
    const qOrderCosecha = BDService.queryRemoveByRel(ETablas.OrdenFertilizacion, ETablas.Order)
    await pool.query(qOrderCosecha, [orderId])

    const qOrder = BDService.queryRemoveById(ETablas.Order)
    await pool.query(qOrder, [orderId])
  }

  removeFertilizacion = async (_: IOrderFertilizacion): Promise<void> => {}

  // #region Utils
  createDataOrdenFertilizacion = async (datos: ICreateDatosFertilizacion): Promise<IDatosFertilizacion> => {
    const tabla = ETablas.OrdenFertilizacion

    const newDatosFertilizacion: IDatosFertilizacion = {
      ...datos,

      id: randomUUID()
    }

    const queryInsertDatos = BDService.queryInsert<IDatosFertilizacion>(tabla, newDatosFertilizacion)

    const result = await pool.query(queryInsertDatos.query, queryInsertDatos.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al insertar los datos de la fertlizacion')

    return newDatosFertilizacion
  }
  // #endregion
}
