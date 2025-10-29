import { ETablas } from '../types/enums'
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
