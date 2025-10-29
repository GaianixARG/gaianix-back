"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteController = void 0;
const response_controller_1 = __importDefault(require("./response.controller"));
const enums_1 = require("../types/enums");
const validateBody_1 = require("../middlewares/validateBody");
class LoteController {
    constructor(models) {
        this.getLotes = async (_req, res) => {
            try {
                const lotes = await this.models.loteModel.getLotes();
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK, { exito: true, data: lotes });
            }
            catch (err) {
                console.log(err);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.NOT_FOUND, { exito: false, message: 'Error al obtener los lotes' });
            }
        };
        this.getLoteById = async (req, res) => {
            const id = req.params.id;
            let lote;
            let exito = true;
            try {
                lote = await this.models.loteModel.getById(id);
                if (lote == null)
                    exito = false;
            }
            catch (err) {
                exito = false;
                console.log(err);
            }
            finally {
                if (exito)
                    (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK, { exito: true, data: lote });
                else
                    (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Error al obtener el lote' });
            }
        };
        this.createLote = async (req, res) => {
            const bodySeed = (0, validateBody_1.getValidatedBody)(req);
            let newLote;
            try {
                newLote = await this.models.loteModel.create(bodySeed);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK_CREATED, {
                    exito: true,
                    data: newLote
                });
            }
            catch (err) {
                console.log(err);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Error al crear el lote' });
            }
        };
        this.models = models;
    }
}
exports.LoteController = LoteController;
