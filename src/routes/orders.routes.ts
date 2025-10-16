import { Router } from 'express'
import { IOrderController, OrderController } from '../controllers/orders.controller'
import { validateBody } from '../middlewares/validateBody'
import { createOrderSchema, orderSchema } from '../schemas/order.schema'
import { authenticateJWT } from '../middlewares/auth'

export const createOrderRouter = (models: IOrderController): Router => {
  const orderRouter = Router()
  const orderController = new OrderController(models)

  /**
     * @swagger
     * tags:
     *   name: Orders
     *   description: Gestión de órdenes de trabajo
     */

  /**
     * @swagger
     * /orders:
     *   get:
     *     summary: Obtener todas las órdenes
     *     tags: [Orders]
     *     responses:
     *       200:
     *         description: Lista de órdenes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Order'
     */
  orderRouter.get('/', authenticateJWT, orderController.getOrders)

  /**
     * @swagger
     * /orders/{id}:
     *   get:
     *     summary: Obtener una orden por ID
     *     tags: [Orders]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID de la orden
     *     responses:
     *       200:
     *         description: Orden encontrada
     *       404:
     *         description: Orden no encontrada
     */
  orderRouter.get('/:id', authenticateJWT, orderController.getOrderById)

  /**
     * @swagger
     * /orders:
     *   post:
     *     summary: Crear una orden
     *     tags: [Orders]
     *     requestBody:
     *      description: Datos de la orden
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  $ref: "#/components/schemas/OrderCreate"
     *     responses:
     *       400:
     *         description: Datos incorrectos
     *       201:
     *         description: Orden creada
     */
  orderRouter.post('/', authenticateJWT, validateBody(createOrderSchema), orderController.createOrder)

  orderRouter.put('/:id', authenticateJWT, validateBody(orderSchema), orderController.updateOrder)

  orderRouter.delete('/:id', authenticateJWT, orderController.removeOrder)

  return orderRouter
}
