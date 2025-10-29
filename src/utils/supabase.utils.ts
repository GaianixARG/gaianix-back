import { PostgrestError, SupabaseClient } from '@supabase/supabase-js'
import { getTableRels } from './global.utils'
import { AllKeys, TablasMap } from '../schemas/mappings'
import { ETablas } from '../types/enums'

export const querySelectSupabase = (tabla: ETablas): string => {
  const queryJoin = getTableRels(tabla).map((t) => `${t} (*)`).join(',')

  return `
      *,
      ${queryJoin}
    `
}

export const getValuesToSupabase = <T extends {}>(tabla: ETablas, objectBody: T): Record<string, any> => {
  const tableMap = TablasMap[tabla]
  const mapTable = tableMap.map

  const objectKeys = Object.keys(objectBody).map(x => x as AllKeys)
  const objectValues = tableMap.values(objectKeys, objectBody)

  const value: Record<string, any> = {}
  objectKeys.forEach((objKey) => {
    const col = mapTable[objKey]
    if (col == null) return
    value[col] = objectValues[objKey]
  })
  return value
}

export const upsert = async <T extends {}>(clientSupabase: SupabaseClient, table: ETablas, datos: T): Promise<PostgrestError | null> => {
  const values = getValuesToSupabase<T>(table, datos)
  const { error } = await clientSupabase.from(table).upsert(values)
  return error
}
