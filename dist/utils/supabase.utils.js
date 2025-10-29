"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsert = exports.getValuesToSupabase = exports.querySelectSupabase = void 0;
const global_utils_1 = require("./global.utils");
const mappings_1 = require("../schemas/mappings");
const querySelectSupabase = (tabla) => {
    const queryJoin = (0, global_utils_1.getTableRels)(tabla).map((t) => `${t} (*)`).join(',');
    return `
      *,
      ${queryJoin}
    `;
};
exports.querySelectSupabase = querySelectSupabase;
const getValuesToSupabase = (tabla, objectBody) => {
    const tableMap = mappings_1.TablasMap[tabla];
    const mapTable = tableMap.map;
    const objectKeys = Object.keys(objectBody).map(x => x);
    const objectValues = tableMap.values(objectKeys, objectBody);
    const value = {};
    objectKeys.forEach((objKey) => {
        const col = mapTable[objKey];
        if (col == null)
            return;
        value[col] = objectValues[objKey];
    });
    return value;
};
exports.getValuesToSupabase = getValuesToSupabase;
const upsert = async (clientSupabase, table, datos) => {
    const values = (0, exports.getValuesToSupabase)(table, datos);
    const { error } = await clientSupabase.from(table).upsert(values);
    return error;
};
exports.upsert = upsert;
