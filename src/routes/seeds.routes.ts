import { Router } from 'express'
import { ISeedController, SeedController } from '../controllers/seeds.controller'
import { createSeedSchema, seedSchema } from '../schemas/seed.schema'
import { validateBody } from '../middlewares/validateBody'
import { authenticateJWT } from '../middlewares/auth'

export const createSeedRouter = (models: ISeedController): Router => {
  const seedRouter = Router()
  const seedController = new SeedController(models)
  /**
     * @swagger
     * tags:
     *   name: Seeds
     *   description: Gestión de semillas
     */

  /**
     * @swagger
     * /seeds:
     *   get:
     *     summary: Obtener todas las semillas
     *     tags: [Seeds]
     *     responses:
     *       200:
     *         description: Lista de semillas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Seed'
     */
  seedRouter.get('/', authenticateJWT, seedController.getSeeds)

  seedRouter.get('/:id', authenticateJWT, seedController.getSeedById)

  /**
     * @swagger
     * /seeds:
     *   post:
     *     summary: Crear una semilla
     *     tags: [Seeds]
     *     requestBody:
     *      description: Datos de la semilla
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  $ref: "#/components/schemas/SeedCreate"
     *     responses:
     *       400:
     *         description: Datos incorrectos
     *       201:
     *         description: Semilla creada
     */
  seedRouter.post('/', authenticateJWT, validateBody(createSeedSchema), seedController.createSeed)

  seedRouter.put('/:id', authenticateJWT, validateBody(seedSchema), seedController.updateSeed)

  seedRouter.delete('/:id', authenticateJWT, seedController.removeSeed)

  return seedRouter
}
