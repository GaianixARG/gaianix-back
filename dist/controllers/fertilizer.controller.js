"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FertilizerController = void 0;
const response_controller_1 = __importDefault(require("./response.controller"));
const enums_1 = require("../types/enums");
const validateBody_1 = require("../middlewares/validateBody");
class FertilizerController {
    constructor(models) {
        this.getFertilizers = async (_req, res) => {
            let fertilizers = [];
            let exito = true;
            try {
                fertilizers = await this.models.fertilizerModel.getAll();
            }
            catch (err) {
                exito = false;
                console.log(err);
            }
            finally {
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK, {
                    exito,
                    data: fertilizers
                });
            }
        };
        this.getFertilizerById = async (req, res) => {
            const id = req.params.id;
            let fertilizer;
            let exito = true;
            try {
                fertilizer = await this.models.fertilizerModel.getById(id);
                if (fertilizer == null)
                    exito = false;
            }
            catch (err) {
                exito = false;
                console.log(err);
            }
            finally {
                const status = exito ? enums_1.EHttpStatusCode.OK : enums_1.EHttpStatusCode.NOT_FOUND;
                (0, response_controller_1.default)(res, status, { exito: true, data: fertilizer });
            }
        };
        this.createFertilizer = async (req, res) => {
            const bodyFertilizer = (0, validateBody_1.getValidatedBody)(req);
            try {
                const newFertilizer = await this.models.fertilizerModel.create(bodyFertilizer);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK_CREATED, { exito: true, data: newFertilizer });
            }
            catch (err) {
                console.log(err);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Error al crear el fertilizante' });
            }
        };
        this.updateFertilizer = async (req, res) => {
            const fertilizerId = req.params?.id ?? '';
            const bodyFertilizer = (0, validateBody_1.getValidatedBody)(req);
            let exito = true;
            try {
                if (fertilizerId !== bodyFertilizer.id) {
                    (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Orden invalida' });
                    return;
                }
                await this.models.fertilizerModel.update(bodyFertilizer);
            }
            catch (err) {
                console.log(err);
                exito = false;
            }
            finally {
                (0, response_controller_1.default)(res, exito ? enums_1.EHttpStatusCode.OK_NO_CONTENT : enums_1.EHttpStatusCode.BAD_REQUEST, exito ? undefined : { exito, message: 'Error al editar el fertilizante' });
            }
        };
        this.removeFertilizer = async (req, res) => {
            const fertilizerId = req.params?.id ?? '';
            let exito = true;
            try {
                await this.models.fertilizerModel.remove(fertilizerId);
            }
            catch (err) {
                console.log(err);
                exito = false;
            }
            finally {
                (0, response_controller_1.default)(res, exito ? enums_1.EHttpStatusCode.OK_NO_CONTENT : enums_1.EHttpStatusCode.BAD_REQUEST, exito ? undefined : { exito, message: 'Error al eliminar el fertilizante' });
            }
        };
        this.models = models;
    }
}
exports.FertilizerController = FertilizerController;
