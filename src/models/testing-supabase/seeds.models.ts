import { randomUUID } from 'crypto'
import { TablasMap } from '../../schemas/mappings'
import { ISeed, ICreateSeed, seedSchema } from '../../schemas/seed.schema'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { ISeedModel } from '../definitions/seeds.models'
import supabase from '../../config/supabase'

export class SeedModelTestingSupabase implements ISeedModel {
  Table: ETablas = ETablas.Seed
  MapTable = TablasMap[this.Table]

  getAll = async (): Promise<ISeed[]> => {
    const mapTable = this.MapTable.map
    if (mapTable.type == null) return []

    const { data } = await supabase.from(this.Table).select().order(mapTable.type)
    if (data == null) return []

    return data.map((row) => {
      const seedDt = BDService.getObjectFromTable(this.Table, row, true)
      return seedSchema.parse(seedDt)
    })
  }

  getById = async (id: string): Promise<ISeed | undefined> => {
    const mapTable = this.MapTable.map
    if (mapTable.id == null) return undefined

    const { data } = await supabase.from(this.Table).select().eq(mapTable.id, id).single()
    if (data == null) return undefined

    const seedDt = BDService.getObjectFromTable(this.Table, data, true)
    return seedSchema.parse(seedDt)
  }

  create = async (seed: ICreateSeed): Promise<ISeed> => {
    const newSeed: ISeed = {
      ...seed,
      id: randomUUID()
    }

    const error = await BDService.upsert<ISeed>(this.Table, newSeed)
    if (error != null) throw new Error('Error al crear la semilla')

    return newSeed
  }

  update = async (seed: ISeed): Promise<void> => {
    const error = await BDService.upsert(this.Table, seed)
    if (error != null) throw new Error('Error al actualizar la semilla')
  }

  remove = async (id: string): Promise<void> => {
    const mapTable = this.MapTable.map
    if (mapTable.id == null) return

    await supabase.from(this.Table).delete().eq(mapTable.id, id)
  }
}
