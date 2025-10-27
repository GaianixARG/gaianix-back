import { PostgrestError } from '@supabase/supabase-js'
import { ETablas } from '../types/enums'
import supabase from '../config/supabase'
import { BDService } from '../services/bd.services'
import { TablasMap } from '../schemas/mappings'

export function aplanarObjeto (obj: any, resultado: any = {}): any {
  for (const clave in obj) {
    if (typeof obj[clave] === 'object' && obj[clave] !== null) {
      aplanarObjeto(obj[clave], resultado)
    } else {
      resultado[clave] = obj[clave]
    }
  }
  return resultado
}

export const upsert = async <T extends {}>(table: ETablas, fertilizer: T): Promise<PostgrestError | null> => {
  const values = BDService.getValuesToSupabase<T>(table, fertilizer)
  const { error } = await supabase.from(table).upsert(values)
  return error
}

export const getTableRels = (tabla: ETablas): string[] => {
  const rels = TablasMap[tabla].rels

  let relations: string[] = []
  Object.keys(rels).forEach((tableHija) => {
    relations.push(tableHija)
    const subTable = tableHija as ETablas
    const relsSubTable = getTableRels(subTable)
    if (relsSubTable.length > 0) relations = [...relations, ...relsSubTable]
  })

  return relations
}
