import { ISeed, ICreateSeed } from '../../schemas/seed.schema'

export interface ISeedModel {
  getAll: () => Promise<ISeed[]>
  getById: (id: string) => Promise<ISeed | undefined>
  create: (seed: ICreateSeed) => Promise<ISeed>
  update: (id: string, seed: ISeed) => Promise<void>
  remove: (id: string) => Promise<void>
}
