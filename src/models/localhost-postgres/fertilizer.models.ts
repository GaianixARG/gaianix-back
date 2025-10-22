import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { fertilizerSchema, ICreateFertilizer, IFertilizer } from '../../schemas/fertilizer.schema'
import { TablasMap } from '../../schemas/mappings'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { IFertilizerModel } from '../definitions/fertilizer.models'

export class FertilizerModelLocalPostgres implements IFertilizerModel {
  getAll = async (): Promise<IFertilizer[]> => {
    const table = ETablas.Fertilizante
    const mapTable = TablasMap[table].map
    if (mapTable.name == null) return []

    const result = await pool.query(`${BDService.querySelect(table)} ORDER BY ${mapTable.name}`)
    return result.rows.map((row) => {
      const fertilizerDt = BDService.getObjectFromTable(table, row)
      return fertilizerSchema.parse(fertilizerDt)
    })
  }

  getById = async (id: string): Promise<IFertilizer | undefined> => {
    const table = ETablas.Fertilizante
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${BDService.querySelect(table)} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const fertilizerDt = BDService.getObjectFromTable(table, result.rows[0])
    return fertilizerSchema.parse(fertilizerDt)
  }

  create = async (fertilizer: ICreateFertilizer): Promise<IFertilizer> => {
    const newFertilizer: IFertilizer = {
      ...fertilizer,
      id: randomUUID()
    }

    const datosInsert = BDService.queryInsert<IFertilizer>(ETablas.Fertilizante, newFertilizer)
    const result = await pool.query(`${datosInsert.query}`, datosInsert.values)
    if (result == null || result.rowCount === 0) throw new Error('Error al crear el fertilizante')

    return newFertilizer
  }

  update = async (id: string, fertilizer: IFertilizer): Promise<void> => {
    const { id: idFert, ...updateFertilizer } = fertilizer
    const datosUpdate = BDService.queryUpdate<ICreateFertilizer>(ETablas.Fertilizante, updateFertilizer, true)

    const result = await pool.query(datosUpdate.query, [...datosUpdate.values, id])
    if (result == null || result.rowCount === 0) throw new Error('Error al actualizar el fertilizante')
  }

  remove = async (id: string): Promise<void> => {
    const queryRemove = BDService.queryRemoveById(ETablas.Fertilizante)
    if (queryRemove === '') throw new Error('Error al eliminar el fertilizante')

    await pool.query(queryRemove, [id])
  }
}
