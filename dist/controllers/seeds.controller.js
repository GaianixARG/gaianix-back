"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedController = void 0;
const response_controller_1 = __importDefault(require("./response.controller"));
const enums_1 = require("../types/enums");
const validateBody_1 = require("../middlewares/validateBody");
class SeedController {
    constructor(models) {
        this.getSeeds = async (_req, res) => {
            let seeds = [];
            let exito = true;
            try {
                seeds = await this.models.seedModel.getAll();
            }
            catch (err) {
                exito = false;
                console.log(err);
            }
            finally {
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK, {
                    exito,
                    data: seeds
                });
            }
        };
        this.getSeedById = async (req, res) => {
            const id = req.params.id;
            let seed;
            let exito = true;
            try {
                seed = await this.models.seedModel.getById(id);
                if (seed == null)
                    exito = false;
            }
            catch (err) {
                exito = false;
                console.log(err);
            }
            finally {
                const status = exito ? enums_1.EHttpStatusCode.OK : enums_1.EHttpStatusCode.NOT_FOUND;
                (0, response_controller_1.default)(res, status, { exito: true, data: seed });
            }
        };
        this.createSeed = async (req, res) => {
            const bodySeed = (0, validateBody_1.getValidatedBody)(req);
            let newSeed;
            try {
                newSeed = await this.models.seedModel.create(bodySeed);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK_CREATED, {
                    exito: true,
                    data: newSeed
                });
            }
            catch (err) {
                console.log(err);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Error al crear la semilla' });
            }
        };
        this.updateSeed = async (req, res) => {
            const seedId = req.params?.id ?? '';
            const bodySeed = (0, validateBody_1.getValidatedBody)(req);
            let exito = true;
            try {
                if (seedId !== bodySeed.id)
                    throw new Error();
                await this.models.seedModel.update(bodySeed);
            }
            catch (err) {
                console.log(err);
                exito = false;
            }
            finally {
                (0, response_controller_1.default)(res, exito ? enums_1.EHttpStatusCode.OK_NO_CONTENT : enums_1.EHttpStatusCode.BAD_REQUEST, exito ? undefined : { exito, message: 'Error al editar la semilla' });
            }
        };
        this.removeSeed = async (req, res) => {
            const seedId = req.params?.id ?? '';
            let exito = true;
            try {
                await this.models.seedModel.remove(seedId);
            }
            catch (err) {
                console.log(err);
                exito = false;
            }
            finally {
                (0, response_controller_1.default)(res, exito ? enums_1.EHttpStatusCode.OK_NO_CONTENT : enums_1.EHttpStatusCode.BAD_REQUEST, exito ? undefined : { exito, message: 'Error al eliminar la semilla' });
            }
        };
        this.models = models;
    }
}
exports.SeedController = SeedController;
