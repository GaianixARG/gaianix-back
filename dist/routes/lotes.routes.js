"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLotesRouter = void 0;
const express_1 = require("express");
const lote_controller_1 = require("../controllers/lote.controller");
const auth_1 = require("../middlewares/auth");
const lote_schema_1 = require("../schemas/lote.schema");
const validateBody_1 = require("../middlewares/validateBody");
const createLotesRouter = (models) => {
    const loteRouter = (0, express_1.Router)();
    const loteController = new lote_controller_1.LoteController(models);
    loteRouter.get('/', auth_1.authenticateJWT, loteController.getLotes);
    loteRouter.get('/:id', auth_1.authenticateJWT, loteController.getLoteById);
    loteRouter.post('/', auth_1.authenticateJWT, (0, validateBody_1.validateBody)(lote_schema_1.createLoteSchema), loteController.createLote);
    return loteRouter;
};
exports.createLotesRouter = createLotesRouter;
