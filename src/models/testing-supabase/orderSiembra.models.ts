import { randomUUID } from 'crypto'
import { TablasMap } from '../../schemas/mappings'
import { IOrderSiembra, IOrderBase, ICreateDatosSiembra, orderSiembraSchema, IDatosSemilla, ICreateDatosSemilla, IDatosSiembra } from '../../schemas/order.schema'
import { BDService } from '../../services/bd.services'
import { EOrderType, ETablas } from '../../types/enums'
import { IOrderSiembraModel } from '../definitions/orderSiembra.models'
import { querySelectOrdenByTypeSupabase } from '../../utils/order.utils'
import { SupabaseClient } from '@supabase/supabase-js'
import { update, insert } from '../../utils/supabase.utils'

export class OrderSiembraModelTestingSupabase implements IOrderSiembraModel {
  Table = ETablas.OrdenSiembra
  MapTable = TablasMap[this.Table].map

  supabase: SupabaseClient
  constructor (supabase: SupabaseClient) {
    this.supabase = supabase
  }

  getAll = async (): Promise<IOrderSiembra[]> => {
    const tableOrder = ETablas.Order
    const mapTableOrder = TablasMap[tableOrder].map
    if (mapTableOrder.dateOfCreation == null || mapTableOrder.type == null) return []

    const query = querySelectOrdenByTypeSupabase(EOrderType.Siembra)
    const { data } = await this.supabase.from(tableOrder).select(query).eq(mapTableOrder.type, EOrderType.Siembra).order(mapTableOrder.dateOfCreation)
    if (data == null) return []

    return data.map((row) => {
      const orderDt = BDService.getObjectFromTable(tableOrder, row, true)
      return orderSiembraSchema.parse(orderDt)
    })
  }

  getById = async (id: string): Promise<IOrderSiembra | undefined> => {
    const tableOrder = ETablas.Order
    const mapTableOrder = TablasMap[tableOrder].map
    if (mapTableOrder.id == null) return undefined

    const query = querySelectOrdenByTypeSupabase(EOrderType.Siembra)
    const { data } = await this.supabase.from(tableOrder).select(query).eq(mapTableOrder.id, id).single()
    if (data == null) return undefined

    const orderDt = BDService.getObjectFromTable(tableOrder, data, true)
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
    await this.updateDatosSemillaPorSiembra(datosSiembra.datosSemilla)

    const error = await update<IDatosSiembra>(this.supabase, this.Table, datosSiembra)
    if (error != null) throw new Error('Error al crear la orden de trabajo')
  }

  remove = async (_: string): Promise<void> => {}

  removeSiembra = async (orderSiembra: IOrderSiembra): Promise<void> => {
    await this.removeDatosSemillaSiembra(orderSiembra.siembra.datosSemilla.id)

    const mapTable = this.MapTable
    if (mapTable.id == null) return

    await this.supabase.from(this.Table).delete().eq(mapTable.id, orderSiembra.siembra.id)
  }

  // #region Utils
  // #region Create
  createDataSemillaPorSiembra = async (datos: ICreateDatosSemilla): Promise<IDatosSemilla> => {
    const tabla = ETablas.SemillaPorSiembra
    const newDatosSemilla: IDatosSemilla = {
      ...datos,
      id: randomUUID()
    }

    const error = await insert<IDatosSemilla>(this.supabase, tabla, newDatosSemilla)
    if (error != null) throw new Error('Error al insertar los datos de la siembra')

    return newDatosSemilla
  }

  createDataOrdenSiembra = async (datos: ICreateDatosSiembra): Promise<IDatosSiembra> => {
    // creo la asociación con la semilla (SemillaXSiembra)
    const semillaXSiembra = await this.createDataSemillaPorSiembra(datos.datosSemilla)

    const newDatosSiembra: IDatosSiembra = {
      ...datos,
      datosSemilla: semillaXSiembra,
      id: randomUUID()
    }
    const error = await insert<IDatosSiembra>(this.supabase, this.Table, newDatosSiembra)
    if (error != null) throw new Error('Error al insertar la Orden de Trabajo de Siembra')

    return newDatosSiembra
  }
  // #endregion

  // #region Update
  updateDatosSemillaPorSiembra = async (datos: IDatosSemilla): Promise<void> => {
    const error = await update<IDatosSemilla>(this.supabase, ETablas.SemillaPorSiembra, datos)
    if (error != null) throw new Error('Error al actualizar la orden de siembra')
  }
  // #endregion

  // #region Remove
  removeDatosSemillaSiembra = async (idDatosSemilla: string): Promise<void> => {
    const tabla = ETablas.SemillaPorSiembra
    const mapTable = TablasMap[tabla].map
    if (mapTable.id == null) return

    await this.supabase.from(tabla).delete().eq(mapTable.id, idDatosSemilla)
  }
  // #endregion
  // #endregion
}
