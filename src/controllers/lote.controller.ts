import { Request, Response } from 'express'
import sendData from './response.controller'
import { EHttpStatusCode } from '../types/enums'
import { ILote } from '../schemas/lote.schema'
import { ILoteModel } from '../models/definitions/lote.models'

export interface ILoteController {
  loteModel: ILoteModel
}

export class LoteController {
  models: ILoteController

  constructor (models: ILoteController) {
    this.models = models
  }

  getLotes = async (_req: Request, res: Response): Promise<void> => {
    let lotes: ILote[] = []
    let exito = true
    try {
      lotes = await this.models.loteModel.getLotes()
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      sendData(res,
        EHttpStatusCode.OK,
        {
          exito,
          data: lotes
        }
      )
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
      const status = exito ? EHttpStatusCode.OK : EHttpStatusCode.NOT_FOUND
      sendData(res, status, { exito: true, data: lote })
    }
  }
}
