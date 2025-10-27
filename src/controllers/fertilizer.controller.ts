import { Request, Response } from 'express'
import sendData from './response.controller'
import { EHttpStatusCode } from '../types/enums'
import { ICreateFertilizer, IFertilizer } from '../schemas/fertilizer.schema'
import { getValidatedBody } from '../middlewares/validateBody'
import { IFertilizerModel } from '../models/definitions/fertilizer.models'

export interface IFertilizerController {
  fertilizerModel: IFertilizerModel
}

export class FertilizerController {
  models: IFertilizerController

  constructor (models: IFertilizerController) {
    this.models = models
  }

  getFertilizers = async (_req: Request, res: Response): Promise<void> => {
    let fertilizers: IFertilizer[] = []
    let exito = true
    try {
      fertilizers = await this.models.fertilizerModel.getAll()
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      sendData(res,
        EHttpStatusCode.OK,
        {
          exito,
          data: fertilizers
        }
      )
    }
  }

  getFertilizerById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    let fertilizer: IFertilizer | undefined
    let exito: boolean = true
    try {
      fertilizer = await this.models.fertilizerModel.getById(id)
      if (fertilizer == null) exito = false
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      const status = exito ? EHttpStatusCode.OK : EHttpStatusCode.NOT_FOUND
      sendData(res, status, { exito: true, data: fertilizer })
    }
  }

  createFertilizer = async (req: Request, res: Response): Promise<void> => {
    const bodyFertilizer = getValidatedBody<ICreateFertilizer>(req)

    try {
      const newFertilizer = await this.models.fertilizerModel.create(bodyFertilizer)
      sendData(res,
        EHttpStatusCode.OK_CREATED,
        { exito: true, data: newFertilizer }
      )
    } catch (err) {
      console.log(err)
      sendData(res,
        EHttpStatusCode.BAD_REQUEST,
        { exito: false, message: 'Error al crear el fertilizante' }
      )
    }
  }

  updateFertilizer = async (req: Request, res: Response): Promise<void> => {
    const fertilizerId = req.params?.id ?? ''
    const bodyFertilizer = getValidatedBody<IFertilizer>(req)

    let exito = true
    try {
      if (fertilizerId !== bodyFertilizer.id) {
        sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Orden invalida' })
        return
      }

      await this.models.fertilizerModel.update(bodyFertilizer)
    } catch (err) {
      console.log(err)
      exito = false
    } finally {
      sendData(res,
        exito ? EHttpStatusCode.OK_NO_CONTENT : EHttpStatusCode.BAD_REQUEST,
        exito ? undefined : { exito, message: 'Error al editar el fertilizante' }
      )
    }
  }

  removeFertilizer = async (req: Request, res: Response): Promise<void> => {
    const fertilizerId = req.params?.id ?? ''

    let exito = true
    try {
      await this.models.fertilizerModel.remove(fertilizerId)
    } catch (err) {
      console.log(err)
      exito = false
    } finally {
      sendData(res,
        exito ? EHttpStatusCode.OK_NO_CONTENT : EHttpStatusCode.BAD_REQUEST,
        exito ? undefined : { exito, message: 'Error al eliminar el fertilizante' }
      )
    }
  }
}
