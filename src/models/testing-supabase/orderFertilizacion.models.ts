import { randomUUID } from 'crypto'
import { TablasMap } from '../../schemas/mappings'
import { IOrderFertilizacion, IOrderBase, ICreateDatosFertilizacion, orderFertilizacionSchema, IDatosFertilizacion } from '../../schemas/order.schema'
import { BDService } from '../../services/bd.services'
import { EOrderType, ETablas } from '../../types/enums'
import { IOrderFertilizacionModel } from '../definitions/orderFertilizacion.models'
import supabase from '../../config/supabase'
import { querySelectOrdenByTypeSupabase } from '../../utils/order.utils'

export class OrderFertilizacionModelTestingSupabase implements IOrderFertilizacionModel {
  Table = ETablas.OrdenFertilizacion
  MapTable = TablasMap[this.Table].map

  getAll = async (): Promise<IOrderFertilizacion[]> => {
    const tableOrder = ETablas.Order
    const mapTableOrder = TablasMap[tableOrder].map
    if (mapTableOrder.dateOfCreation == null || mapTableOrder.type == null) return []

    const query = querySelectOrdenByTypeSupabase(EOrderType.Fertilizacion)

    const { data } = await supabase.from(tableOrder).select(query).eq(mapTableOrder.type, EOrderType.Fertilizacion).order(mapTableOrder.dateOfCreation)
    if (data == null) return []

    return data.map((row) => {
      const orderDt = BDService.getObjectFromTable(tableOrder, row, true)
      return orderFertilizacionSchema.parse(orderDt)
    })
  }

  getById = async (id: string): Promise<IOrderFertilizacion | undefined> => {
    const tableOrder = ETablas.Order
    const mapTableOrder = TablasMap[tableOrder].map
    if (mapTableOrder.id == null) return undefined

    const query = querySelectOrdenByTypeSupabase(EOrderType.Fertilizacion)

    const { data } = await supabase.from(tableOrder).select(query).eq(mapTableOrder.id, id).single()
    if (data == null) return undefined

    const orderDt = BDService.getObjectFromTable(tableOrder, data, true)
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
    const error = await BDService.upsert<IDatosFertilizacion>(this.Table, datosFertilizacion)
    if (error != null) throw new Error('Error al actualizar la orden de fertilización')
  }

  remove = async (_: string): Promise<void> => {}

  removeFertilizacion = async (orderFert: IOrderFertilizacion): Promise<void> => {
    const mapTable = this.MapTable
    if (mapTable.id == null) return

    await supabase.from(this.Table).delete().eq(mapTable.id, orderFert.fertilizacion.id)
  }

  // #region Utils
  createDataOrdenFertilizacion = async (datos: ICreateDatosFertilizacion): Promise<IDatosFertilizacion> => {
    const newDatosFertilizacion: IDatosFertilizacion = {
      ...datos,

      id: randomUUID()
    }

    const error = await BDService.upsert<IDatosFertilizacion>(this.Table, newDatosFertilizacion)
    if (error != null) throw new Error('Error al insertar los datos de la cosecha')

    return newDatosFertilizacion
  }
  // #endregion
}
