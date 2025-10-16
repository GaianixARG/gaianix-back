import { Router } from 'express'
import { authenticateJWT } from '../middlewares/auth'
import { FertilizerController, IFertilizerController } from '../controllers/fertilizer.controller'
import { validateBody } from '../middlewares/validateBody'
import { createFertilizerSchema, fertilizerSchema } from '../schemas/fertilizer.schema'

export const createFertilizerRouter = (models: IFertilizerController): Router => {
  const fertilizerRouter = Router()

  const fertilizerController = new FertilizerController(models)

  fertilizerRouter.get('/', authenticateJWT, fertilizerController.getFertilizers)
  fertilizerRouter.get('/:id', authenticateJWT, fertilizerController.getFertilizerById)
  fertilizerRouter.post('/', authenticateJWT, validateBody(createFertilizerSchema), fertilizerController.createFertilizer)
  fertilizerRouter.put('/:id', authenticateJWT, validateBody(fertilizerSchema), fertilizerController.updateFertilizer)
  fertilizerRouter.delete('/:id', authenticateJWT, fertilizerController.removeFertilizer)

  return fertilizerRouter
}
