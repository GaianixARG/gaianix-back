import { randomUUID } from 'crypto'
import { coordPoligonoSchema, ICoordenada, ICoordenadaPoligono, ICreateCoordenada, ICreatePoligonoLote, IPoligonoLote } from '../../schemas/lote.schema'
import { TablasMap } from '../../schemas/mappings'
import { BDService } from '../../services/bd.services'
import { IPoligonoLoteModel } from '../definitions/poligonoLote.models'
import { ETablas } from '../../types/enums'
import { randomColor } from '../../utils/global.utils'
import { SupabaseClient } from '@supabase/supabase-js'
import { insert, insertMultiple, querySelectSupabase } from '../../utils/supabase.utils'

const queryGetPoligonoLote = (): string => {
  const tableCoordenada = ETablas.Coordenada

  return querySelectSupabase(tableCoordenada)
}

export class PoligonoLoteModelTestingSupabase implements IPoligonoLoteModel {
  private readonly Table = ETablas.PoligonoLote

  supabase: SupabaseClient
  constructor (supabase: SupabaseClient) {
    this.supabase = supabase
  }

  prepareResponsePoligonos = (result: any[]): IPoligonoLote[] => {
    const tableCoordenada = ETablas.Coordenada

    const poligonos: IPoligonoLote[] = []
    result.forEach((row) => {
      const coordDt = BDService.getObjectFromTable(tableCoordenada, row, true)
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
    const tableCoordenada = ETablas.Coordenada
    const mapTable = TablasMap[tableCoordenada].map
    if (mapTable.poligono == null || poligonoIds.length === 0) return []

    const query = queryGetPoligonoLote()
    const { data } = await this.supabase.from(tableCoordenada).select(query).in(mapTable.poligono, poligonoIds)
    if (data == null) return []

    const poligonos = this.prepareResponsePoligonos(data)
    if (poligonos.length === 0) return []

    return poligonos
  }

  getById = async (id: string): Promise<IPoligonoLote | undefined> => {
    const tableCoordenada = ETablas.Coordenada
    const mapTable = TablasMap[tableCoordenada].map
    if (mapTable.poligono == null) return undefined

    const query = queryGetPoligonoLote()
    const { data } = await this.supabase.from(tableCoordenada).select(query).eq(mapTable.poligono, id)
    if (data == null) return undefined

    const poligonos = this.prepareResponsePoligonos(data)
    if (poligonos.length === 0) return undefined

    return poligonos[0]
  }

  createCoordenadas = async (poligono: IPoligonoLote, coordenadas: ICreateCoordenada[]): Promise<ICoordenada[]> => {
    const newCoords: ICoordenada[] = []
    const newCoordsInsert: ICoordenadaPoligono[] = []
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

      newCoords.push(newCoord)
      newCoordsInsert.push(newCoordPoligono)
    }
    const error = await insertMultiple<ICoordenadaPoligono>(this.supabase, ETablas.Coordenada, newCoordsInsert)
    if (error != null) throw new Error('Error al crear las coordenadas')
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

    const error = await insert<IPoligonoLote>(this.supabase, this.Table, newPolygon)
    if (error != null) throw new Error('Error al crear el poligono')

    const newCoords = await this.createCoordenadas(newPolygon, coordenadas)
    newPolygon.coordenadas = newCoords

    return newPolygon
  }
}
