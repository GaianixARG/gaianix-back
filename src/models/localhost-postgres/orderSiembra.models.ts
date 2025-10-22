import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { TablasMap } from '../../schemas/mappings'
import { IOrderSiembra, IOrderBase, ICreateDatosSiembra, orderSiembraSchema, IDatosSemilla, ICreateDatosSemilla, IDatosSiembra } from '../../schemas/order.schema'
import { BDService } from '../../services/bd.services'
import { EOrderType, ETablas } from '../../types/enums'
import { IOrderSiembraModel } from '../definitions/orderSiembra.models'
import { querySelectOrdenByType } from '../../utils/order.utils'

const querySelectOrdenSiembra = (): string => {
  return querySelectOrdenByType(EOrderType.Siembra)
}

export class OrderSiembraModelLocalPostgres implements IOrderSiembraModel {
  getAll = async (): Promise<IOrderSiembra[]> => {
    const table = ETablas.Order
    const mapTable = TablasMap[table].map
    if (mapTable.dateOfCreation == null || mapTable.type == null) return []

    const result = await pool.query(`${querySelectOrdenSiembra()} WHERE ${mapTable.type} = $1 ORDER BY ${mapTable.dateOfCreation} DESC`, [EOrderType.Siembra])

    return result.rows.map((row) => {
      const orderDt = BDService.getObjectFromTable(table, row)
      return orderSiembraSchema.parse(orderDt)
    })
  }

  getById = async (id: string): Promise<IOrderSiembra | undefined> => {
    const table = ETablas.Order
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${querySelectOrdenSiembra()} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const orderDt = BDService.getObjectFromTable(table, result.rows[0])
    return orderSiembraSchema.parse(orderDt)
  }

  create = async (orderBase: IOrderBase, datosSiembra: ICreateDatosSiembra): Promise<IOrderSiembra> => {
    return {
      ...orderBase,
      type: EOrderType.Siembra,
      siembra: await this.createDataOrdenSiembra(datosSiembra)
    }
  }

  update = async (datosSiembra: IDatosSiembra): Promise<void> => {
    const { id, ...restOfSiembra } = datosSiembra

    await this.updateDatosSemillaPorSiembra(restOfSiembra.datosSemilla)

    const datosUpdate = BDService.queryUpdate<ICreateDatosSiembra>(ETablas.OrdenSiembra, restOfSiembra, true)
    const result = await pool.query(datosUpdate.query, [...datosUpdate.values, id])
    if (result == null || result.rowCount === 0) throw new Error('Error al actualizar la orden de siembra')
  }

  remove = async (orderId: string): Promise<void> => {
    await this.removeOrderSiembra(orderId)

    const query = BDService.queryRemoveById(ETablas.Order)
    await pool.query(query, [orderId])
  }

  // #region Utils
  // #region Create
  createDataSemillaPorSiembra = async (datos: ICreateDatosSemilla): Promise<IDatosSemilla> => {
    const tabla = ETablas.SemillaPorSiembra
    const newDatosSemilla: IDatosSemilla = {
      ...datos,
      id: randomUUID()
    }
    const queryInsertDatos = BDService.queryInsert<IDatosSemilla>(tabla, newDatosSemilla)

    const result = await pool.query(queryInsertDatos.query, queryInsertDatos.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al insertar los datos de la siembra')

    return newDatosSemilla
  }

  createDataOrdenSiembra = async (datos: ICreateDatosSiembra): Promise<IDatosSiembra> => {
    // creo la asociación con la semilla (SemillaXSiembra)
    const semillaXSiembra = await this.createDataSemillaPorSiembra(datos.datosSemilla)
    const tabla = ETablas.OrdenSiembra

    const newDatosSiembra: IDatosSiembra = {
      ...datos,
      datosSemilla: semillaXSiembra,
      id: randomUUID()
    }
    const queryInsertDatos = BDService.queryInsert<IDatosSiembra>(tabla, newDatosSiembra)

    const result = await pool.query(queryInsertDatos.query, queryInsertDatos.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al insertar la Orden de Trabajo de Siembra')

    return newDatosSiembra
  }
  // #endregion

  // #region Update
  updateDatosSemillaPorSiembra = async (datos: IDatosSemilla): Promise<void> => {
    const { id, ...restOfData } = datos

    const datosUpdate = BDService.queryUpdate<ICreateDatosSemilla>(ETablas.SemillaPorSiembra, restOfData, true)
    const result = await pool.query(datosUpdate.query, [...datosUpdate.values, id])
    if (result == null || result.rowCount === 0) throw new Error('Error al actualizar la orden de siembra')
  }
  // #endregion

  // #region Remove
  removeDatosSemillaSiembra = async (orderId: string): Promise<void> => {
    const query = BDService.queryRemoveByRel(ETablas.SemillaPorSiembra, ETablas.Order)
    await pool.query(query, [orderId])
  }

  removeOrderSiembra = async (orderId: string): Promise<void> => {
    await this.removeDatosSemillaSiembra(orderId)

    const query = BDService.queryRemoveByRel(ETablas.OrdenSiembra, ETablas.Order)
    await pool.query(query, [orderId])
  }
  // #endregion
  // #endregion
}
