import { ICreatePoligonoLote, IPoligonoLote } from '../../schemas/lote.schema'

export interface IPoligonoLoteModel {
  getPoligonos: (poligonoIds: string[]) => Promise<IPoligonoLote[]>
  getById: (id: string) => Promise<IPoligonoLote | undefined>
  create: (poligono: ICreatePoligonoLote) => Promise<IPoligonoLote>
}
