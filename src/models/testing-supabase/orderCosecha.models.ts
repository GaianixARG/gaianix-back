import { randomUUID } from 'crypto'
import { IOrderCosecha, IOrderBase, ICreateDatosCosecha, IDatosCosecha, orderCosechaSchema } from '../../schemas/order.schema'
import { BDService } from '../../services/bd.services'
import { EOrderType, ETablas } from '../../types/enums'
import { IOrderCosechaModel } from '../definitions/orderCosecha.models'
import { TablasMap } from '../../schemas/mappings'
import { querySelectOrdenByTypeSupabase } from '../../utils/order.utils'
import { SupabaseClient } from '@supabase/supabase-js'
import { upsert } from '../../utils/supabase.utils'

export class OrderCosechaModelTestingSupabase implements IOrderCosechaModel {
  Table = ETablas.OrdenCosecha
  MapTable = TablasMap[this.Table].map

  supabase: SupabaseClient
  constructor (supabase: SupabaseClient) {
    this.supabase = supabase
  }

  getAll = async (): Promise<IOrderCosecha[]> => {
    const tableOrder = ETablas.Order
    const mapTableOrder = TablasMap[tableOrder].map
    if (mapTableOrder.dateOfCreation == null || mapTableOrder.type == null) return []

    const query = querySelectOrdenByTypeSupabase(EOrderType.Cosecha)
    const { data } = await this.supabase.from(tableOrder).select(query).eq(mapTableOrder.type, EOrderType.Cosecha).order(mapTableOrder.dateOfCreation)
    if (data == null) return []

    return data.map((row) => {
      const orderDt = BDService.getObjectFromTable(tableOrder, row, true)
      console.log(orderDt)
      return orderCosechaSchema.parse(orderDt)
    })
  }

  getById = async (id: string): Promise<IOrderCosecha | undefined> => {
    const tableOrder = ETablas.Order
    const mapTableOrder = TablasMap[tableOrder].map
    if (mapTableOrder.id == null) return undefined

    const query = querySelectOrdenByTypeSupabase(EOrderType.Cosecha)

    const { data } = await this.supabase.from(tableOrder).select(query).eq(mapTableOrder.id, id).single()
    if (data == null) return undefined

    const orderDt = BDService.getObjectFromTable(tableOrder, data, true)
    return orderCosechaSchema.parse(orderDt)
  }

  create = async (orderBase: IOrderBase, datosCosecha: ICreateDatosCosecha): Promise<IOrderCosecha> => {
    return {
      ...orderBase,
      type: EOrderType.Cosecha,
      cosecha: await this.createDataOrdenCosecha(datosCosecha)
    }
  }

  update = async (datosCosecha: IDatosCosecha): Promise<void> => {
    const error = await upsert<IDatosCosecha>(this.supabase, this.Table, datosCosecha)
    if (error != null) throw new Error('Error al actualizar la orden de cosecha')
  }

  remove = async (_: string): Promise<void> => { }

  removeCosecha = async (orderCosecha: IOrderCosecha): Promise<void> => {
    const mapTable = this.MapTable
    if (mapTable.id == null) return

    await this.supabase.from(this.Table).delete().eq(mapTable.id, orderCosecha.cosecha.id)
  }

  createDataOrdenCosecha = async (datos: ICreateDatosCosecha): Promise<IDatosCosecha> => {
    const newDatosCosecha: IDatosCosecha = {
      ...datos,
      id: randomUUID()
    }

    const error = await upsert<IDatosCosecha>(this.supabase, this.Table, newDatosCosecha)
    if (error != null) throw new Error('Error al insertar los datos de la cosecha')

    return newDatosCosecha
  }
}
