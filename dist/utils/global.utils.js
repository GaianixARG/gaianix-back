"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableRels = void 0;
exports.aplanarObjeto = aplanarObjeto;
const mappings_1 = require("../schemas/mappings");
function aplanarObjeto(obj, resultado = {}) {
    for (const clave in obj) {
        if (typeof obj[clave] === 'object' && obj[clave] !== null) {
            aplanarObjeto(obj[clave], resultado);
        }
        else {
            resultado[clave] = obj[clave];
        }
    }
    return resultado;
}
const getTableRels = (tabla) => {
    const rels = mappings_1.TablasMap[tabla].rels;
    let relations = [];
    Object.keys(rels).forEach((tableHija) => {
        relations.push(tableHija);
        const subTable = tableHija;
        const relsSubTable = (0, exports.getTableRels)(subTable);
        if (relsSubTable.length > 0)
            relations = [...relations, ...relsSubTable];
    });
    return relations;
};
exports.getTableRels = getTableRels;
