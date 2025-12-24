import { ICreateLote, ILote } from '../../schemas/lote.schema'
import { ILoteModel } from '../definitions/lote.models'

const lotes: ILote[] = []

export class LoteModelLocalPostgres implements ILoteModel {
  getLotes = async (): Promise<ILote[]> => lotes

  getById = async (id: string): Promise<ILote | undefined> => {
    return lotes.find(x => x.id === id)
  }

  create = async (lote: ICreateLote): Promise<ILote> => {
    const { coordenadas, ...resOfPoligono } = lote.poligono
    const newLote: ILote = {
      ...lote,
      id: '55',
      poligono: {
        ...resOfPoligono,
        coordenadas: coordenadas.map(x => ({ id: '1', ...x })),
        id: '10'
      }
    }
    lotes.push(newLote)
    return newLote
  }
}
