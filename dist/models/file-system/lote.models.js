"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteModelLocalPostgres = void 0;
const lotes = [];
class LoteModelLocalPostgres {
    constructor() {
        this.getLotes = async () => lotes;
        this.getById = async (id) => {
            return lotes.find(x => x.id === id);
        };
        this.create = async (lote) => {
            const newLote = {
                id: '55',
                ...lote
            };
            lotes.push(newLote);
            return newLote;
        };
    }
}
exports.LoteModelLocalPostgres = LoteModelLocalPostgres;
