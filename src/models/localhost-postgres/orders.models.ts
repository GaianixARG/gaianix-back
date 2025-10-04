import { IOrder, ICreateOrder, IDatosSemilla, IDatosSiembra, IDatosFertilizacion, IDatosCosecha, ICreateDatosSiembra, ICreateDatosCosecha, ICreateDatosFertilizacion, ICreateDatosSemilla, IOrderBase, IOrderSiembra, IOrderFertilizacion, IOrderCosecha, orderSchema } from '../../schemas/order.schema'
import { IUserPrivate } from '../../schemas/user.schema'
import pool from '../../config/db'
import { IOrderModel } from '../definitions/orders.models'
import { EOrderType, ETablas } from '../../types/enums'
import { BDService } from '../../services/bd.services'
import { KeysDatosCosecha, KeysDatosFertilizacion, KeysDatosSemilla, KeysDatosSiembra, KeysOrden, TablasMap } from '../../schemas/mappings'

const querySelectOdT = (): string => `SELECT *
  FROM "${ETablas.Order}"
  ${BDService.queryJoin('INNER', ETablas.Order, ETablas.User)}
  ${BDService.queryJoin('INNER', ETablas.User, ETablas.Rol)}
  ${BDService.queryJoin('LEFT', ETablas.Order, ETablas.OrdenSiembra)}
  ${BDService.queryJoin('LEFT', ETablas.OrdenSiembra, ETablas.DatosSemillaXSiembra)}
  ${BDService.queryJoin('LEFT', ETablas.DatosSemillaXSiembra, ETablas.Seed)}
  ${BDService.queryJoin('LEFT', ETablas.Order, ETablas.OrdenCosecha)}
  ${BDService.queryJoin('LEFT', ETablas.Order, ETablas.OrdenFertilizacion)}`

const queryGetNewCode = (type: EOrderType): string => `WITH ultimo AS (
  SELECT
    MAX(CAST(SUBSTRING(codigo, 2) AS INTEGER)) AS max_num
    FROM "OrdenDeTrabajo"
    WHERE tipo = '${type}'
  )
  SELECT
    CONCAT(
      '${type}',
      LPAD((COALESCE(ultimo.max_num, 0) + 1)::text, 5, '0')
    ) AS nuevo_codigo
  FROM ultimo;`

export class OrderModelLocalPostgres implements IOrderModel {
  getAll = async (): Promise<IOrder[]> => {
    const mapTable = TablasMap[ETablas.Order].map
    if (mapTable.dateOfCreation == null) return []
    const result = await pool.query(`${querySelectOdT()} ORDER BY ${mapTable.dateOfCreation} DESC`)

    return result.rows.map((row) => BDService.getObjectFromTable(ETablas.Order, row))
  }

  getById = async (id: string): Promise<IOrder | undefined> => {
    const mapTable = TablasMap[ETablas.Order].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${querySelectOdT()} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const orderDt = BDService.getObjectFromTable(ETablas.Order, result.rows[0])

    const order: IOrder = orderSchema.parse(orderDt)
    return order
  }

  create = async (order: ICreateOrder, creator: IUserPrivate): Promise<IOrder> => {
    // crear la orden
    const queryInsertOdt = BDService.queryInsert<KeysOrden, ICreateOrder>(ETablas.Order, order)
    const nuevoCodigoOrden = await this.getNewCodeOrder(order.type)

    const newOrderBase: IOrderBase = {
      // no importan pq lo insertamos en la base
      id: '',
      dateOfCreation: '',
      // estos si importan
      creator,
      codigo: nuevoCodigoOrden,
      title: order.title,
      type: order.type,
      status: order.status,
      lote: order.lote,
      prioridad: order.prioridad
    }

    const newOrder = await this.createOrderByType(newOrderBase, order)
    if (newOrder == null) throw new Error('Error al crear la orden de trabajo')

    const result = await pool.query(`${queryInsertOdt.query}`, queryInsertOdt.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al crear la orden de trabajo')
    const orderCreated = result.rows[0]

    return {
      ...newOrder,
      id: orderCreated.id,
      dateOfCreation: orderCreated.dateOfCreation
    }
  }

  // #region Utils
  // #region CreateOrder
  getNewCodeOrder = async (type: EOrderType): Promise<string> => {
    const result = await pool.query(queryGetNewCode(type))
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al definir el codigo')
    return result.rows[0]?.codigo ?? ''
  }

  createDataSemillaPorSiembra = async (datos: ICreateDatosSemilla): Promise<IDatosSemilla> => {
    const tabla = ETablas.DatosSemillaXSiembra
    const queryInsertDatos = BDService.queryInsert<KeysDatosSemilla, ICreateDatosSemilla>(tabla, datos)

    const result = await pool.query(`${queryInsertDatos.query}`, queryInsertDatos.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al insertar los datos de la siembra')
    const semillaXSiembraId = result.rows[0].id
    return {
      ...datos,
      id: semillaXSiembraId
    }
  }

  createDataOrdenSiembra = async (datos: ICreateDatosSiembra): Promise<IDatosSiembra> => {
    // creo la asociación con la semilla (SemillaXSiembra)
    const semillaXSiembra = await this.createDataSemillaPorSiembra(datos.datosSemilla)

    const tabla = ETablas.OrdenSiembra
    const queryInsertDatos = BDService.queryInsert<KeysDatosSiembra, ICreateDatosSiembra>(tabla, datos)

    const result = await pool.query(`${queryInsertDatos.query}`, queryInsertDatos.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al insertar la Orden de Trabajo de Siembra')
    const datosSiembraId = result.rows[0].id

    return {
      ...datos,
      id: datosSiembraId,
      datosSemilla: semillaXSiembra
    }
  }

  createDataOrdenCosecha = async (datos: ICreateDatosCosecha): Promise<IDatosCosecha> => {
    const tabla = ETablas.OrdenCosecha
    const queryInsertDatos = BDService.queryInsert<KeysDatosCosecha, ICreateDatosCosecha>(tabla, datos)

    const result = await pool.query(`${queryInsertDatos.query}`, queryInsertDatos.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al insertar los datos de la cosecha')
    const datosCosechaId = result.rows[0].id
    return {
      ...datos,
      id: datosCosechaId
    }
  }

  createDataOrdenFertilizacion = async (datos: ICreateDatosFertilizacion): Promise<IDatosFertilizacion> => {
    const tabla = ETablas.OrdenFertilizacion
    const queryInsertDatos = BDService.queryInsert<KeysDatosFertilizacion, ICreateDatosFertilizacion>(tabla, datos)

    const result = await pool.query(`${queryInsertDatos.query}`, queryInsertDatos.values)
    if (result.rowCount == null || result.rowCount === 0) throw new Error('Error al insertar los datos de la fertlizacion')
    const datosFertilziacionId = result.rows[0].id
    return {
      ...datos,
      id: datosFertilziacionId
    }
  }

  createOrderByType = async (orderBase: IOrderBase, order: ICreateOrder): Promise<IOrder | null> => {
    if (order.type === EOrderType.Siembra) {
      const newOrderSiembra: IOrderSiembra = {
        ...orderBase,
        type: EOrderType.Siembra,
        siembra: await this.createDataOrdenSiembra(order.siembra)
      }

      return newOrderSiembra
    }
    if (order.type === EOrderType.Cosecha) {
      const newOrderCosecha: IOrderCosecha = {
        ...orderBase,
        type: EOrderType.Cosecha,
        cosecha: await this.createDataOrdenCosecha(order.cosecha)
      }

      return newOrderCosecha
    }
    if (order.type === EOrderType.Fertilizacion) {
      const newOrderFertilizacion: IOrderFertilizacion = {
        ...orderBase,
        type: EOrderType.Fertilizacion,
        fertilizacion: await this.createDataOrdenFertilizacion(order.fertilizacion)
      }

      return newOrderFertilizacion
    }

    return null
  }
  // #endregion
  // #endregion
}
