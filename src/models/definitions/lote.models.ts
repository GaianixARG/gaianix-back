import { ILote } from '../../schemas/lote.schema'

export interface ILoteModel {
  getLotes: () => Promise<ILote[]>
  getById: (id: string) => Promise<ILote | undefined>
}
