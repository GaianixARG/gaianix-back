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

  getSeedById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    let seed: ISeed | undefined
    let exito: boolean = true
    try {
      seed = await this.models.seedModel.getById(id)
      if (seed == null) exito = false
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      const status = exito ? EHttpStatusCode.OK : EHttpStatusCode.NOT_FOUND
      sendData(res, status, { exito: true, data: seed })
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

  updateSeed = async (req: Request, res: Response): Promise<void> => {
    const seedId = req.params?.id ?? ''
    const bodySeed = getValidatedBody<ISeed>(req)

    let exito = true
    try {
      await this.models.seedModel.update(seedId, bodySeed)
    } catch (err) {
      console.log(err)
      exito = false
    } finally {
      sendData(res,
        exito ? EHttpStatusCode.OK_NO_CONTENT : EHttpStatusCode.BAD_REQUEST,
        exito ? undefined : { exito, message: 'Error al editar la semilla' }
      )
    }
  }

  removeSeed = async (req: Request, res: Response): Promise<void> => {
    const seedId = req.params?.id ?? ''

    let exito = true
    try {
      await this.models.seedModel.remove(seedId)
    } catch (err) {
      console.log(err)
      exito = false
    } finally {
      sendData(res,
        exito ? EHttpStatusCode.OK_NO_CONTENT : EHttpStatusCode.BAD_REQUEST,
        exito ? undefined : { exito, message: 'Error al eliminar la semilla' }
      )
    }
  }
}
