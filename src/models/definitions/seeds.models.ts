import { ISeed, ICreateSeed } from '../../schemas/seed.schema'

export interface ISeedModel {
  getAll: () => Promise<ISeed[]>
  create: (seed: ICreateSeed) => Promise<ISeed>
}
