import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { TablasMap } from '../../schemas/mappings'
import { ISeed, ICreateSeed, seedSchema } from '../../schemas/seed.schema'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { ISeedModel } from '../definitions/seeds.models'

export class SeedModelLocalPostgres implements ISeedModel {
  getAll = async (): Promise<ISeed[]> => {
    const table = ETablas.Seed
    const mapTable = TablasMap[table].map
    if (mapTable.type == null) return []

    const result = await pool.query(`SELECT * FROM "${table}" ORDER BY ${mapTable.type} DESC`)
    return result.rows.map((row) => {
      const seedDt = BDService.getObjectFromTable(table, row)
      return seedSchema.parse(seedDt)
    })
  }

  getById = async (id: string): Promise<ISeed | undefined> => {
    const table = ETablas.Seed
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${BDService.querySelect(table)} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const seedDt = BDService.getObjectFromTable(table, result.rows[0])
    return seedSchema.parse(seedDt)
  }

  create = async (seed: ICreateSeed): Promise<ISeed> => {
    const newSeed: ISeed = {
      ...seed,
      id: randomUUID()
    }

    const datosInsert = BDService.queryInsert<ISeed>(ETablas.Seed, newSeed)
    const result = await pool.query(`${datosInsert.query}`, datosInsert.values)
    if (result == null || result.rowCount === 0) throw new Error('Error al crear la semilla')

    return newSeed
  }

  update = async (seed: ISeed): Promise<void> => {
    const { id, ...updateSeed } = seed
    const datosUpdate = BDService.queryUpdate<ICreateSeed>(ETablas.Seed, updateSeed, true)

    const result = await pool.query(datosUpdate.query, [...datosUpdate.values, id])
    if (result == null || result.rowCount === 0) throw new Error('Error al actualizar la semilla')
  }

  remove = async (id: string): Promise<void> => {
    const queryRemove = BDService.queryRemoveById(ETablas.Seed)
    if (queryRemove === '') throw new Error('Error al eliminar la semilla')

    await pool.query(queryRemove, [id])
  }
}
