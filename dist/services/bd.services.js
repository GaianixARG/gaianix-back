"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BDService = void 0;
const mappings_1 = require("../schemas/mappings");
const global_utils_1 = require("../utils/global.utils");
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class BDService {
}
exports.BDService = BDService;
_a = BDService;
BDService.querySelect = (table) => {
    const mapTable = mappings_1.TablasMap[table];
    let joins = '';
    Object.keys(mapTable.rels).map(x => x).forEach((tableRel) => {
        joins += `${_a.queryJoin('INNER', table, tableRel)} `;
    });
    return `SELECT * FROM "${table}" ${joins}`;
};
BDService.queryJoin = (tipo, left, right) => {
    const leftTable = mappings_1.TablasMap[left];
    const rightTable = mappings_1.TablasMap[right];
    const colRelation = leftTable.rels[right];
    if (colRelation == null)
        throw new Error(`No existe la relación ${left} => ${right}`);
    const pkRight = rightTable.map?.id ?? `${rightTable.alias}_id`;
    return `${tipo} JOIN "${right}" ${rightTable.alias} ON (${colRelation} = ${rightTable.alias}.${pkRight})`;
};
BDService.queryInsert = (tabla, objectBody) => {
    const tableMap = mappings_1.TablasMap[tabla];
    const mapTable = tableMap.map;
    const objectKeys = Object.keys(mapTable).map(x => x);
    // ESTO PARA QUE QUEDE ORDENADO EN LA QUERY
    const columns = objectKeys.map(x => mapTable[x]).join(',');
    const values = objectKeys.map((_, i) => `$${i + 1}`).join(',');
    const valuesToInsert = tableMap.values(objectKeys, objectBody);
    return {
        query: `INSERT INTO "${tabla}"
      (${columns})
      VALUES (${values})`,
        values: Object.values(valuesToInsert)
    };
};
BDService.queryUpdate = (tabla, objectBody, byId) => {
    const tableMap = mappings_1.TablasMap[tabla];
    const mapTable = tableMap.map;
    const objectKeys = Object.keys(objectBody).map(x => x);
    // ESTO PARA QUE QUEDE ORDENADO EN LA QUERY
    const columns = [];
    objectKeys.forEach((objKey, idx) => {
        const col = mapTable[objKey];
        if (col == null)
            return;
        columns.push(`${col} = $${idx + 1}`);
    });
    const whereById = mapTable.id != null && byId ? `WHERE ${mapTable.id} = $${objectKeys.length + 1}` : '';
    const valuesToUpdate = tableMap.values(objectKeys, objectBody);
    return {
        query: `UPDATE "${tabla}"
      SET ${columns.join(',')}
      ${whereById}`,
        values: Object.values(valuesToUpdate)
    };
};
BDService.getObjectFromTable = (table, dataDt, isSupabase = false) => {
    if (isSupabase)
        dataDt = (0, global_utils_1.aplanarObjeto)(dataDt);
    const mapTable = mappings_1.TablasMap[table];
    const map = mapTable.map;
    const colXTableRel = {};
    Object.entries(mapTable.rels).forEach(([table, col]) => { colXTableRel[col] = table; });
    const objectTransformed = {};
    Object.entries(map).forEach(([property, columna]) => {
        const tableRelation = colXTableRel[columna];
        const valueObj = dataDt[columna];
        if (tableRelation != null)
            objectTransformed[property] = valueObj != null ? _a.getObjectFromTable(tableRelation, dataDt) : null;
        else {
            objectTransformed[property] = (valueObj instanceof Date
                ? `${valueObj.toISOString()}`
                : valueObj);
        }
    });
    return objectTransformed;
};
BDService.queryRemoveById = (table) => {
    const mapTable = mappings_1.TablasMap[table].map;
    if (mapTable.id == null)
        return '';
    return `DELETE FROM "${table}" WHERE ${mapTable.id} = $1`;
};
BDService.queryRemoveByRel = (table, fromTable) => {
    const mapTableFrom = mappings_1.TablasMap[fromTable].map;
    if (mapTableFrom.id == null)
        return '';
    const rels = _a.getRelationsFromTableToAnother(fromTable, table);
    const tablesUsed = Object.keys(rels).join('","');
    const whereJoin = [];
    let actualTable = fromTable;
    while (actualTable !== table) {
        const relTable = rels[actualTable];
        if (relTable == null)
            return '';
        const mapTable = mappings_1.TablasMap[actualTable];
        const colRelTable = mapTable.rels[relTable];
        if (colRelTable == null)
            return '';
        const mapTableRelTable = mappings_1.TablasMap[relTable].map;
        if (mapTableRelTable.id == null)
            return '';
        whereJoin.push(`${colRelTable} = ${mapTableRelTable.id}`);
        actualTable = relTable;
    }
    return `
    DELETE
    FROM "${table}"
    USING "${tablesUsed}" 
    WHERE
      ${mapTableFrom.id} = $1 AND ${whereJoin.join(' AND ')}
    `;
};
BDService.getRelationsFromTableToAnother = (from, to) => {
    const mapTableFrom = mappings_1.TablasMap[from];
    let rels = {};
    const relations = Object.entries(mapTableFrom.rels);
    for (const [t] of relations) {
        const table = t;
        if (table === to) {
            rels[from] = table;
            break;
        }
        const auxRels = _a.getRelationsFromTableToAnother(table, to);
        if (Object.keys(auxRels).length > 0) {
            auxRels[from] = table;
            rels = { ...auxRels };
            break;
        }
    }
    return rels;
};
