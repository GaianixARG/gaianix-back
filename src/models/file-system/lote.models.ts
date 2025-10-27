import { ICreateLote, ILote } from '../../schemas/lote.schema'
import { ILoteModel } from '../definitions/lote.models'

const lotes: ILote[] = []

export class LoteModelLocalPostgres implements ILoteModel {
  getLotes = async (): Promise<ILote[]> => lotes

  getById = async (id: string): Promise<ILote | undefined> => {
    return lotes.find(x => x.id === id)
  }

  create = async (lote: ICreateLote): Promise<ILote> => {
    const newLote = {
      id: '55',
      ...lote
    }
    lotes.push(newLote)
    return newLote
  }
}
