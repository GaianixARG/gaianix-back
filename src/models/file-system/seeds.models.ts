import { ISeed, ICreateSeed } from '../../schemas/seed.schema'
import dataSeeds from '../../data/seeds.json'
import { ISeedModel } from '../definitions/seeds.models'

const seeds: ISeed[] = dataSeeds as ISeed[]

export class SeedModelFileSystem implements ISeedModel {
  getAll = async (): Promise<ISeed[]> => seeds
  create = async (seed: ICreateSeed): Promise<ISeed> => {
    const newSeed = {
      id: '55',
      ...seed
    }
    seeds.push(newSeed)
    return newSeed
  }
}
