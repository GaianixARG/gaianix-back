import { ISeed, ICreateSeed } from '../../schemas/seed.schema'
import dataSeeds from '../../data/seeds.json'
import { ISeedModel } from '../definitions/seeds.models'

const seeds: ISeed[] = dataSeeds as ISeed[]

export class SeedModelFileSystem implements ISeedModel {
  getById = async (id: string): Promise<ISeed | undefined> => {
    return seeds.find(x => x.id === id)
  }

  update = async (seed: ISeed): Promise<void> => {
    const idx = seeds.findIndex(x => x.id === seed.id)
    if (idx === -1) return
    seeds[idx] = seed
  }

  remove = async (id: string): Promise<void> => {
    seeds.filter(x => x.id !== id)
  }

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
