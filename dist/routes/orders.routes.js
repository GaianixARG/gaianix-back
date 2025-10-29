"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRouter = void 0;
const express_1 = require("express");
const orders_controller_1 = require("../controllers/orders.controller");
const validateBody_1 = require("../middlewares/validateBody");
const order_schema_1 = require("../schemas/order.schema");
const auth_1 = require("../middlewares/auth");
const createOrderRouter = (models) => {
    const orderRouter = (0, express_1.Router)();
    const orderController = new orders_controller_1.OrderController(models);
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
    orderRouter.get('/', auth_1.authenticateJWT, orderController.getOrders);
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
    orderRouter.get('/:id', auth_1.authenticateJWT, orderController.getOrderById);
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
    orderRouter.post('/', auth_1.authenticateJWT, (0, validateBody_1.validateBody)(order_schema_1.createOrderSchema), orderController.createOrder);
    orderRouter.put('/:id', auth_1.authenticateJWT, (0, validateBody_1.validateBody)(order_schema_1.orderSchema), orderController.updateOrder);
    orderRouter.delete('/:id', auth_1.authenticateJWT, orderController.removeOrder);
    return orderRouter;
};
exports.createOrderRouter = createOrderRouter;
