import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { coordPoligonoSchema, ICoordenada, ICoordenadaPoligono, ICreateCoordenada, ICreatePoligonoLote, IPoligonoLote } from '../../schemas/lote.schema'
import { TablasMap } from '../../schemas/mappings'
import { BDService } from '../../services/bd.services'
import { IPoligonoLoteModel } from '../definitions/poligonoLote.models'
import { ETablas } from '../../types/enums'
import { QueryResult } from 'pg'
import { randomColor } from '../../utils/global.utils'

const queryGetPoligonoLote = (): string => {
  const tableCoordenada = ETablas.Coordenada

  return BDService.querySelect(tableCoordenada)
}

export class PoligonoLoteModelLocalPostgres implements IPoligonoLoteModel {
  private readonly Table = ETablas.PoligonoLote

  prepareResponsePoligonos = (result: QueryResult<any>): IPoligonoLote[] => {
    const tableCoordenada = ETablas.Coordenada

    const poligonos: IPoligonoLote[] = []
    result.rows.forEach((row) => {
      const coordDt = BDService.getObjectFromTable(tableCoordenada, row)
      const { poligono, ...coord } = coordPoligonoSchema.parse(coordDt)

      const idxPol = poligonos.findIndex(p => p.id === poligono.id)
      if (idxPol === -1) poligonos.push({ ...poligono, coordenadas: [coord] })
      else {
        const actualPoligono = poligonos[idxPol]
        actualPoligono.coordenadas.push(coord)
      }
    })

    return poligonos
  }

  getPoligonos = async (poligonoIds: string[]): Promise<IPoligonoLote[]> => {
    const table = ETablas.Coordenada
    const mapTable = TablasMap[table].map
    if (mapTable.poligono == null || poligonoIds.length === 0) return []

    const result = await pool.query(`${queryGetPoligonoLote()} WHERE ${mapTable.poligono} IN ('${poligonoIds.join('\',\'')}')`)

    return this.prepareResponsePoligonos(result)
  }

  getById = async (id: string): Promise<IPoligonoLote | undefined> => {
    const table = ETablas.Coordenada
    const mapTable = TablasMap[table].map
    if (mapTable.poligono == null) return undefined

    const result = await pool.query(`${queryGetPoligonoLote()} WHERE ${mapTable.poligono} = '${id}')`)

    const poligonos = this.prepareResponsePoligonos(result)
    if (poligonos.length === 0) return undefined

    return poligonos[0]
  }

  createCoordenadas = async (poligono: IPoligonoLote, coordenadas: ICreateCoordenada[]): Promise<ICoordenada[]> => {
    const newCoords: ICoordenada[] = []
    for (let i = 0; i < coordenadas.length; i++) {
      const coord = coordenadas[i]

      const newCoord = {
        ...coord,
        id: randomUUID()
      }

      const newCoordPoligono: ICoordenadaPoligono = {
        ...newCoord,
        poligono
      }
      const datosInsert = BDService.queryInsert<ICoordenadaPoligono>(ETablas.Coordenada, newCoordPoligono)
      const result = await pool.query(`${datosInsert.query}`, datosInsert.values)
      if (result == null || result.rowCount === 0) throw new Error('Error al crear las coordenadas')

      newCoords.push(newCoord)
    }
    return newCoords
  }

  create = async (polygon: ICreatePoligonoLote): Promise<IPoligonoLote> => {
    const { coordenadas } = polygon

    const newPolygon: IPoligonoLote = {
      ...polygon,
      coordenadas: [],
      color: randomColor(),
      id: randomUUID()
    }

    const datosInsert = BDService.queryInsert<IPoligonoLote>(this.Table, newPolygon)
    const result = await pool.query(datosInsert.query, datosInsert.values)
    if (result == null || result.rowCount === 0) throw new Error('Error al crear el poligono')

    const newCoords = await this.createCoordenadas(newPolygon, coordenadas)
    newPolygon.coordenadas = newCoords

    return newPolygon
  }
}
