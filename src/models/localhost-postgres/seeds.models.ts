import pool from '../../config/db'
import { KeysSeed } from '../../schemas/mappings'
import { ISeed, ICreateSeed, seedSchema } from '../../schemas/seed.schema'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { ISeedModel } from '../definitions/seeds.models'

export class SeedModelLocalPostgres implements ISeedModel {
  getAll = async (): Promise<ISeed[]> => {
    const result = await pool.query(`SELECT * FROM ${ETablas.Seed} ORDER BY tipo DESC`)
    return result.rows.map((row) => seedSchema.parse(row))
  }

  create = async (seed: ICreateSeed): Promise<ISeed> => {
    const datosInsert = BDService.queryInsert<KeysSeed, ICreateSeed>(ETablas.Seed, seed)
    const result = await pool.query(`${datosInsert.query}`, datosInsert.values)
    if (result == null || result.rowCount === 0) throw new Error('Error al crear la semilla')

    return {
      id: result.rows[0],
      ...seed
    }
  }
}
