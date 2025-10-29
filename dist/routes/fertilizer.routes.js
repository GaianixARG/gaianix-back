"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFertilizerRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const fertilizer_controller_1 = require("../controllers/fertilizer.controller");
const validateBody_1 = require("../middlewares/validateBody");
const fertilizer_schema_1 = require("../schemas/fertilizer.schema");
const createFertilizerRouter = (models) => {
    const fertilizerRouter = (0, express_1.Router)();
    const fertilizerController = new fertilizer_controller_1.FertilizerController(models);
    fertilizerRouter.get('/', auth_1.authenticateJWT, fertilizerController.getFertilizers);
    fertilizerRouter.get('/:id', auth_1.authenticateJWT, fertilizerController.getFertilizerById);
    fertilizerRouter.post('/', auth_1.authenticateJWT, (0, validateBody_1.validateBody)(fertilizer_schema_1.createFertilizerSchema), fertilizerController.createFertilizer);
    fertilizerRouter.put('/:id', auth_1.authenticateJWT, (0, validateBody_1.validateBody)(fertilizer_schema_1.fertilizerSchema), fertilizerController.updateFertilizer);
    fertilizerRouter.delete('/:id', auth_1.authenticateJWT, fertilizerController.removeFertilizer);
    return fertilizerRouter;
};
exports.createFertilizerRouter = createFertilizerRouter;
