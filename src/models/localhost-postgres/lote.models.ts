import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { ICreateLote, ILote, loteSchema } from '../../schemas/lote.schema'
import { TablasMap } from '../../schemas/mappings'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { ILoteModel } from '../definitions/lote.models'
import { PoligonoLoteModelLocalPostgres } from './poligonoLote.models'
import { campoSchema, ICampo } from '../../schemas/campo.schema'

interface ILoteModels {
  poligonoLoteModel: PoligonoLoteModelLocalPostgres
}

export class LoteModelLocalPostgres implements ILoteModel {
  protected models: ILoteModels

  private readonly Table = ETablas.Lote
  private readonly MapTable = TablasMap[this.Table]

  constructor () {
    this.models = {
      poligonoLoteModel: new PoligonoLoteModelLocalPostgres()
    }
  }

  getLotes = async (): Promise<ILote[]> => {
    const table = this.Table
    const mapTable = this.MapTable.map
    if (mapTable.codigo == null) return []

    const result = await pool.query(`${BDService.querySelect(table)} ORDER BY ${mapTable.codigo}`)
    const lotes = result.rows.map((row) => {
      const loteDt = BDService.getObjectFromTable(table, row)
      return loteSchema.parse(loteDt)
    })
    const poligonoIds = lotes.map(l => l.poligono.id)
    const poligonos = await this.models.poligonoLoteModel.getPoligonos(poligonoIds)

    lotes.forEach((l) => {
      const poligonoLote = poligonos.find(p => p.id === l.poligono.id)
      if (poligonoLote == null) return
      l.poligono = poligonoLote
    })

    return lotes
  }

  getById = async (id: string): Promise<ILote | undefined> => {
    const table = this.Table
    const mapTable = this.MapTable.map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${BDService.querySelect(table)} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const loteDt = BDService.getObjectFromTable(table, result.rows[0])
    return loteSchema.parse(loteDt)
  }

  getCampo = async (): Promise<ICampo | undefined> => {
    const tableCampo = ETablas.Campo

    const result = await pool.query(`${BDService.querySelect(tableCampo)}`)
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const campoDt = BDService.getObjectFromTable(tableCampo, result.rows[0])
    return campoSchema.parse(campoDt)
  }

  create = async (lote: ICreateLote): Promise<ILote> => {
    const { poligono, ...restOfLote } = lote

    const newPolygon = await this.models.poligonoLoteModel.create(poligono)

    if (restOfLote.campo.id === '') {
      const campo = await this.getCampo()
      if (campo == null) throw new Error('Error al crear el lote - Campo no encontrado')

      restOfLote.campo = campo
    }

    const newLote: ILote = {
      ...restOfLote,
      id: randomUUID(),
      poligono: newPolygon
    }

    const datosInsert = BDService.queryInsert<ILote>(this.Table, newLote)
    const result = await pool.query(`${datosInsert.query}`, datosInsert.values)
    if (result == null || result.rowCount === 0) throw new Error('Error al crear el lote')

    return newLote
  }
}
