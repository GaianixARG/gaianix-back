import { randomUUID } from 'crypto'
import { ICreateLote, ILote, loteSchema } from '../../schemas/lote.schema'
import { TablasMap } from '../../schemas/mappings'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { ILoteModel } from '../definitions/lote.models'
import { SupabaseClient } from '@supabase/supabase-js'
import { querySelectSupabase, insert } from '../../utils/supabase.utils'
import { PoligonoLoteModelTestingSupabase } from './poligonoLote.models'
import { campoSchema, ICampo } from '../../schemas/campo.schema'

interface ILoteModels {
  poligonoLoteModel: PoligonoLoteModelTestingSupabase
}

export class LoteModelTestingSupabase implements ILoteModel {
  Table: ETablas = ETablas.Lote
  MapTable = TablasMap[this.Table]

  models: ILoteModels

  supabase: SupabaseClient
  constructor (supabase: SupabaseClient) {
    this.supabase = supabase

    this.models = {
      poligonoLoteModel: new PoligonoLoteModelTestingSupabase(supabase)
    }
  }

  getLotes = async (): Promise<ILote[]> => {
    const mapTable = this.MapTable.map
    if (mapTable.codigo == null) return []

    const query = querySelectSupabase(this.Table)
    const { data } = await this.supabase.from(this.Table).select(query).order(mapTable.codigo)
    if (data == null) return []

    const lotes = data.map((row) => {
      const loteDt = BDService.getObjectFromTable(this.Table, row, true)
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
    const mapTable = this.MapTable.map
    if (mapTable.id == null) return undefined

    const query = querySelectSupabase(this.Table)
    const { data } = await this.supabase.from(this.Table).select(query).eq(mapTable.id, id).single()
    if (data == null) return undefined

    const loteDt = BDService.getObjectFromTable(this.Table, data, true)
    return loteSchema.parse(loteDt)
  }

  getCampo = async (): Promise<ICampo | undefined> => {
    const tableCampo = ETablas.Campo
    const query = querySelectSupabase(tableCampo)
    const { data } = await this.supabase.from(this.Table).select(query).single()
    if (data == null) return undefined

    const campoDt = BDService.getObjectFromTable(tableCampo, data, true)
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

    const error = await insert<ILote>(this.supabase, this.Table, newLote)
    if (error != null) throw new Error('Error al crear el lote')

    return newLote
  }
}
