"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeedRouter = void 0;
const express_1 = require("express");
const seeds_controller_1 = require("../controllers/seeds.controller");
const seed_schema_1 = require("../schemas/seed.schema");
const validateBody_1 = require("../middlewares/validateBody");
const auth_1 = require("../middlewares/auth");
const createSeedRouter = (models) => {
    const seedRouter = (0, express_1.Router)();
    const seedController = new seeds_controller_1.SeedController(models);
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
    seedRouter.get('/', auth_1.authenticateJWT, seedController.getSeeds);
    seedRouter.get('/:id', auth_1.authenticateJWT, seedController.getSeedById);
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
    seedRouter.post('/', auth_1.authenticateJWT, (0, validateBody_1.validateBody)(seed_schema_1.createSeedSchema), seedController.createSeed);
    seedRouter.put('/:id', auth_1.authenticateJWT, (0, validateBody_1.validateBody)(seed_schema_1.seedSchema), seedController.updateSeed);
    seedRouter.delete('/:id', auth_1.authenticateJWT, seedController.removeSeed);
    return seedRouter;
};
exports.createSeedRouter = createSeedRouter;
