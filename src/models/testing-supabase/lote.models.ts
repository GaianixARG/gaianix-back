import { randomUUID } from 'crypto'
import { ICreateLote, ILote, loteSchema } from '../../schemas/lote.schema'
import { TablasMap } from '../../schemas/mappings'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { ILoteModel } from '../definitions/lote.models'
import { SupabaseClient } from '@supabase/supabase-js'
import { querySelectSupabase, insert } from '../../utils/supabase.utils'

export class LoteModelTestingSupabase implements ILoteModel {
  Table: ETablas = ETablas.Lote
  MapTable = TablasMap[this.Table]

  supabase: SupabaseClient
  constructor (supabase: SupabaseClient) {
    this.supabase = supabase
  }

  getLotes = async (): Promise<ILote[]> => {
    const mapTable = this.MapTable.map
    if (mapTable.codigo == null) return []

    const query = querySelectSupabase(this.Table)
    const { data } = await this.supabase.from(this.Table).select(query).order(mapTable.codigo)
    if (data == null) return []

    return data.map((row) => {
      const loteDt = BDService.getObjectFromTable(this.Table, row, true)
      return loteSchema.parse(loteDt)
    })
  }

  getById = async (id: string): Promise<ILote | undefined> => {
    const mapTable = this.MapTable.map
    if (mapTable.id == null) return undefined

    const query = querySelectSupabase(this.Table)
    const { data } = await this.supabase.from(this.Table).select(query).eq(mapTable.id, id).single()
    if (data == null) return undefined

    const loteDt = BDService.getObjectFromTable(this.Table, data, true)
    return loteSchema.parse(loteDt)
  }

  create = async (lote: ICreateLote): Promise<ILote> => {
    const newLote: ILote = {
      ...lote,
      id: randomUUID()
    }

    const error = await insert<ILote>(this.supabase, this.Table, newLote)
    if (error != null) throw new Error('Error al crear el lote')

    return newLote
  }
}
