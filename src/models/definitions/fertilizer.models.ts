import { ICreateFertilizer, IFertilizer } from '../../schemas/fertilizer.schema'

export interface IFertilizerModel {
  getAll: () => Promise<IFertilizer[]>
  getById: (id: string) => Promise<IFertilizer | undefined>
  create: (fertilizer: ICreateFertilizer) => Promise<IFertilizer>
  update: (fertilizer: IFertilizer) => Promise<void>
  remove: (id: string) => Promise<void>
}
