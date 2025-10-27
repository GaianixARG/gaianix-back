import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { ICreateLote, ILote, loteSchema } from '../../schemas/lote.schema'
import { TablasMap } from '../../schemas/mappings'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { ILoteModel } from '../definitions/lote.models'

export class LoteModelLocalPostgres implements ILoteModel {
  getLotes = async (): Promise<ILote[]> => {
    const table = ETablas.Lote
    const mapTable = TablasMap[table].map
    if (mapTable.codigo == null) return []

    const result = await pool.query(`${BDService.querySelect(table)} ORDER BY ${mapTable.codigo}`)
    return result.rows.map((row) => {
      const loteDt = BDService.getObjectFromTable(table, row)
      return loteSchema.parse(loteDt)
    })
  }

  getById = async (id: string): Promise<ILote | undefined> => {
    const table = ETablas.Lote
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${BDService.querySelect(table)} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const loteDt = BDService.getObjectFromTable(table, result.rows[0])
    return loteSchema.parse(loteDt)
  }

  create = async (seed: ICreateLote): Promise<ILote> => {
    const newLote: ILote = {
      ...seed,
      id: randomUUID()
    }

    const datosInsert = BDService.queryInsert<ILote>(ETablas.Lote, newLote)
    const result = await pool.query(`${datosInsert.query}`, datosInsert.values)
    if (result == null || result.rowCount === 0) throw new Error('Error al crear la semilla')

    return newLote
  }
}
