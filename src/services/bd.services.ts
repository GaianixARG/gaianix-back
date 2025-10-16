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
  static querySelect = (table: ETablas): string => {
    const mapTable = TablasMap[table]
    let joins: string = ''
    Object.keys(mapTable.rels).map(x => x as ETablas).forEach((tableRel) => {
      joins += `${this.queryJoin('INNER', table, tableRel)} `
    })

    return `SELECT * FROM "${table}" ${joins}`
  }

  static queryJoin = (tipo: TipoJoin, left: ETablas, right: ETablas): string => {
    const leftTable = TablasMap[left]
    const rightTable = TablasMap[right]

    const colRelation = leftTable.rels[right]
    if (colRelation == null) throw new Error(`No existe la relación ${left} => ${right}`)

    const pkRight = rightTable.map?.id ?? `${rightTable.alias}_id`
    return `${tipo} JOIN "${right}" ${rightTable.alias} ON (${colRelation} = ${rightTable.alias}.${pkRight})`
  }

  static queryInsert = <T> (tabla: ETablas, objectBody: T): InserQueryReturn => {
    const tableMap = TablasMap[tabla]
    const mapTable = tableMap.map

    const objectKeys = Object.keys(mapTable).map(x => x as AllKeys)

    // ESTO PARA QUE QUEDE ORDENADO EN LA QUERY
    const columns = objectKeys.map(x => mapTable[x]).join(',')
    const values: string = objectKeys.map((_, i) => `$${i + 1}`).join(',')

    return {
      query: `INSERT INTO "${tabla}"
      (${columns})
      VALUES (${values})`,
      values: tableMap.values(objectKeys, objectBody)
    }
  }

  static queryUpdate = <T extends {}> (tabla: ETablas, objectBody: T): InserQueryReturn => {
    const tableMap = TablasMap[tabla]
    const mapTable = tableMap.map

    const objectKeys = Object.keys(objectBody).map(x => x as AllKeys)

    // ESTO PARA QUE QUEDE ORDENADO EN LA QUERY
    const columns: string[] = []
    objectKeys.forEach((objKey, idx) => {
      const col = mapTable[objKey]
      if (col == null) return
      columns.push(`${col} = $${idx + 1}`)
    })

    return {
      query: `UPDATE "${tabla}"
      SET ${columns.join(',')}`,
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
      else {
        objectTransformed[property] = (valueObj instanceof Date
          ? `${valueObj.toISOString()}`
          : valueObj)
      }
    })

    return objectTransformed
  }

  static queryRemoveById = (table: ETablas): string => {
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return ''

    return `DELETE FROM "${table}" WHERE ${mapTable.id} = $1`
  }

  static queryRemoveByRel = (table: ETablas, fromTable: ETablas): string => {
    const mapTableFrom = TablasMap[fromTable].map
    if (mapTableFrom.id == null) return ''

    const rels = this.getRelationsFromTableToAnother(fromTable, table)
    const tablesUsed = Object.keys(rels).join('","')

    const whereJoin: string[] = []
    let actualTable: ETablas = fromTable

    while (actualTable !== table) {
      const relTable = rels[actualTable]
      if (relTable == null) return ''
      const mapTable = TablasMap[actualTable]

      const colRelTable = mapTable.rels[relTable]
      if (colRelTable == null) return ''

      const mapTableRelTable = TablasMap[relTable].map
      if (mapTableRelTable.id == null) return ''

      whereJoin.push(`${colRelTable} = ${mapTableRelTable.id}`)

      actualTable = relTable
    }

    return `
    DELETE
    FROM "${table}"
    USING "${tablesUsed}" 
    WHERE
      ${mapTableFrom.id} = $1 AND ${whereJoin.join(' AND ')}
    `
  }

  static getRelationsFromTableToAnother = (from: ETablas, to: ETablas): Partial<Record<ETablas, ETablas>> => {
    const mapTableFrom = TablasMap[from]
    let rels: Partial<Record<ETablas, ETablas>> = {}
    const relations = Object.entries(mapTableFrom.rels)
    for (const [t] of relations) {
      const table = t as ETablas
      if (table === to) {
        rels[from] = table
        break
      }
      const auxRels = this.getRelationsFromTableToAnother(table, to)
      if (Object.keys(auxRels).length > 0) {
        auxRels[from] = table
        rels = { ...auxRels }
        break
      }
    }

    return rels
  }
}
