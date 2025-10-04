import { AllKeys, TablasMap } from '../schemas/mappings'
import { ETablas } from '../types/enums'

type TipoJoin = 'INNER' | 'LEFT' | 'RIGHT'

interface InserQueryReturn {
  query: string
  values: any[]
}

interface DictColXTable {
  [key: string]: ETablas
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BDService {
  static queryJoin = (tipo: TipoJoin, left: ETablas, right: ETablas): string => {
    const leftTable = TablasMap[left]
    const rightTable = TablasMap[right]

    const colRelation = leftTable.rels[right]
    if (colRelation == null) throw new Error(`No existe la relación ${left} => ${right}`)

    const pkRight = rightTable.map?.id ?? `${rightTable.alias}_id`
    return `${tipo} JOIN "${right}" ON (${colRelation} = ${pkRight})`
  }

  static queryInsert = <ObjectKey extends AllKeys, T> (tabla: ETablas, objectBody: T): InserQueryReturn => {
    const tableMap = TablasMap[tabla]
    const mapTable = tableMap.map

    const objectKeys = Object.keys(mapTable).map(x => x as ObjectKey)

    // ESTO PARA QUE QUEDE ORDENADO EN LA QUERY
    const columns = objectKeys.map(x => mapTable[x]).join(',')
    const values: string = objectKeys.map((_, i) => `$${i + 1}`).join(',')

    return {
      query: `INSERT INTO ${tabla}
      (${columns})
      VALUES (${values})
      RETURNING id;`,
      values: tableMap.values(objectKeys, objectBody)
    }
  }

  static getObjectFromTable = (table: ETablas, dataDt: any): any => {
    const mapTable = TablasMap[table]
    const map = mapTable.map
    const colXTableRel: DictColXTable = {}
    Object.entries(mapTable.rels).forEach(([table, col]) => { colXTableRel[col] = (table as ETablas) })

    const objectTransformed: any = {}
    Object.entries(map).forEach(([property, columna]) => {
      const tableRelation = colXTableRel[columna]
      const valueObj = dataDt[columna]
      if (tableRelation != null) objectTransformed[property] = valueObj != null ? this.getObjectFromTable(tableRelation, dataDt) : null
      else objectTransformed[property] = (valueObj instanceof Date ? `${valueObj.toISOString()}` : valueObj)
    })

    return objectTransformed
  }
}
