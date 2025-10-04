import { Request, Response } from 'express'
import { ICreateSeed, ISeed } from '../schemas/seed.schema'
import sendData from './response.controller'
import { EHttpStatusCode } from '../types/enums'
import { getValidatedBody } from '../middlewares/validateBody'
import { ISeedModel } from '../models/definitions/seeds.models'

export interface ISeedController {
  seedModel: ISeedModel
}

export class SeedController {
  models: ISeedController

  constructor (models: ISeedController) {
    this.models = models
  }

  getSeeds = async (_req: Request, res: Response): Promise<void> => {
    let seeds: ISeed[] = []
    let exito = true
    try {
      seeds = await this.models.seedModel.getAll()
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      sendData(res,
        EHttpStatusCode.OK,
        {
          exito,
          data: seeds
        }
      )
    }
  }

  createSeed = async (req: Request, res: Response): Promise<void> => {
    const bodySeed = getValidatedBody<ICreateSeed>(req)

    let newSeed: ISeed | undefined
    let exito = true
    try {
      newSeed = await this.models.seedModel.create(bodySeed)
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      sendData(res,
        EHttpStatusCode.OK_CREATED,
        {
          exito,
          data: newSeed
        }
      )
    }
  }
}
