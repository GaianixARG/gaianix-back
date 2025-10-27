import { Router } from 'express'
import { ILoteController, LoteController } from '../controllers/lote.controller'
import { authenticateJWT } from '../middlewares/auth'
import { createLoteSchema } from '../schemas/lote.schema'
import { validateBody } from '../middlewares/validateBody'

export const createLotesRouter = (models: ILoteController): Router => {
  const loteRouter = Router()

  const loteController = new LoteController(models)

  loteRouter.get('/', authenticateJWT, loteController.getLotes)
  loteRouter.get('/:id', authenticateJWT, loteController.getLoteById)
  loteRouter.post('/', authenticateJWT, validateBody(createLoteSchema), loteController.createLote)

  return loteRouter
}
