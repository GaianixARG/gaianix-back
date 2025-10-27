import { Request, Response } from 'express'
import sendData from './response.controller'
import { EHttpStatusCode } from '../types/enums'
import { ICreateLote, ILote } from '../schemas/lote.schema'
import { ILoteModel } from '../models/definitions/lote.models'
import { getValidatedBody } from '../middlewares/validateBody'

export interface ILoteController {
  loteModel: ILoteModel
}

export class LoteController {
  models: ILoteController

  constructor (models: ILoteController) {
    this.models = models
  }

  getLotes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const lotes = await this.models.loteModel.getLotes()
      sendData(res, EHttpStatusCode.OK, { exito: true, data: lotes })
    } catch (err) {
      console.log(err)
      sendData(res, EHttpStatusCode.NOT_FOUND, { exito: false, message: 'Error al obtener los lotes' })
    }
  }

  getLoteById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    let lote: ILote | undefined
    let exito = true
    try {
      lote = await this.models.loteModel.getById(id)
      if (lote == null) exito = false
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      if (exito) sendData(res, EHttpStatusCode.OK, { exito: true, data: lote })
      else sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Error al obtener el lote' })
    }
  }

  createLote = async (req: Request, res: Response): Promise<void> => {
    const bodySeed = getValidatedBody<ICreateLote>(req)

    let newLote: ILote | undefined
    try {
      newLote = await this.models.loteModel.create(bodySeed)
      sendData(res,
        EHttpStatusCode.OK_CREATED,
        {
          exito: true,
          data: newLote
        }
      )
    } catch (err) {
      console.log(err)
      sendData(res,
        EHttpStatusCode.BAD_REQUEST,
        { exito: false, message: 'Error al crear el lote' }
      )
    }
  }
}
