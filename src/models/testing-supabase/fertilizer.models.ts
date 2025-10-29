import { randomUUID } from 'crypto'
import { fertilizerSchema, ICreateFertilizer, IFertilizer } from '../../schemas/fertilizer.schema'
import { TablasMap } from '../../schemas/mappings'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { IFertilizerModel } from '../definitions/fertilizer.models'
import { SupabaseClient } from '@supabase/supabase-js'
import { upsert } from '../../utils/supabase.utils'

export class FertilizerModelTestingSupabase implements IFertilizerModel {
  Table: ETablas = ETablas.Fertilizante
  MapTable = TablasMap[this.Table]

  supabase: SupabaseClient
  constructor (supabase: SupabaseClient) {
    this.supabase = supabase
  }

  getAll = async (): Promise<IFertilizer[]> => {
    const mapTable = this.MapTable.map
    if (mapTable.name == null) return []

    const { data } = await this.supabase.from(this.Table).select().order(mapTable.name)
    if (data == null) return []

    return data.map((row) => {
      const fertilizerDt = BDService.getObjectFromTable(this.Table, row, true)
      return fertilizerSchema.parse(fertilizerDt)
    })
  }

  getById = async (id: string): Promise<IFertilizer | undefined> => {
    const mapTable = this.MapTable.map
    if (mapTable.id == null) return undefined

    const { data } = await this.supabase.from(this.Table).select().eq(mapTable.id, id).single()
    if (data == null) return undefined

    const fertilizerDt = BDService.getObjectFromTable(this.Table, data, true)
    return fertilizerSchema.parse(fertilizerDt)
  }

  create = async (fertilizer: ICreateFertilizer): Promise<IFertilizer> => {
    const newFertilizer: IFertilizer = {
      ...fertilizer,
      id: randomUUID()
    }

    const error = await upsert<IFertilizer>(this.supabase, this.Table, newFertilizer)
    if (error != null) throw new Error('Error al crear el fertilizante')

    return newFertilizer
  }

  update = async (fertilizer: IFertilizer): Promise<void> => {
    const error = await upsert(this.supabase, this.Table, fertilizer)
    if (error != null) throw new Error('Error al actualizar el fertilizante')
  }

  remove = async (id: string): Promise<void> => {
    const mapTable = this.MapTable.map
    if (mapTable.id == null) return

    await this.supabase.from(this.Table).delete().eq(mapTable.id, id)
  }
}
