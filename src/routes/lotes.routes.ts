import { Router } from 'express'
import { ILoteController, LoteController } from '../controllers/lote.controller'
import { authenticateJWT } from '../middlewares/auth'

export const createLotesRouter = (models: ILoteController): Router => {
  const loteRouter = Router()

  const loteController = new LoteController(models)

  loteRouter.get('/', authenticateJWT, loteController.getLotes)
  loteRouter.get('/:id', authenticateJWT, loteController.getLoteById)

  return loteRouter
}
