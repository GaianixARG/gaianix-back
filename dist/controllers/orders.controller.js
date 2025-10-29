"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const response_controller_1 = __importDefault(require("./response.controller"));
const enums_1 = require("../types/enums");
const validateBody_1 = require("../middlewares/validateBody");
const auth_1 = require("../middlewares/auth");
class OrderController {
    constructor(models) {
        this.getOrders = async (req, res) => {
            let orders = [];
            let exito = true;
            try {
                const typeParam = req.query.type;
                if (typeParam == null)
                    orders = await this.models.orderModel.getAll();
                else {
                    const type = typeParam;
                    orders = await this.models.orderModel.getByType(type);
                }
            }
            catch (err) {
                exito = false;
                console.log(err);
            }
            finally {
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK, { exito, data: orders });
            }
        };
        this.getOrderById = async (req, res) => {
            const id = req.params.id;
            let order;
            let exito = true;
            try {
                order = await this.models.orderModel.getById(id);
                if (order == null)
                    exito = false;
            }
            catch (err) {
                exito = false;
                console.log(err);
            }
            finally {
                const status = exito ? enums_1.EHttpStatusCode.OK : enums_1.EHttpStatusCode.NOT_FOUND;
                (0, response_controller_1.default)(res, status, { exito: true, data: order });
            }
        };
        this.createOrder = async (req, res) => {
            const bodyOrder = (0, validateBody_1.getValidatedBody)(req);
            const userSession = (0, auth_1.getUserSession)(req);
            try {
                const user = await this.models.userModel.getById(userSession.id);
                if (user == null) {
                    (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Usuario inexistente' });
                    return;
                }
                const lote = await this.models.loteModel.getById(bodyOrder.lote.id);
                if (lote == null) {
                    (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Debe seleccionar un lote' });
                    return;
                }
                const newOrder = await this.models.orderModel.create(bodyOrder, user, lote);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.OK_CREATED, { exito: true, data: newOrder });
            }
            catch (err) {
                console.log(err);
                (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Error al crear la orden' });
            }
        };
        this.updateOrder = async (req, res) => {
            const id = req.params.id;
            const bodyOrder = (0, validateBody_1.getValidatedBody)(req);
            let exito = true;
            try {
                if (id !== bodyOrder.id) {
                    (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Orden invalida' });
                    return;
                }
                const lote = await this.models.loteModel.getById(bodyOrder.lote.id);
                if (lote == null) {
                    (0, response_controller_1.default)(res, enums_1.EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Debe seleccionar un lote' });
                    return;
                }
                const { codigo, dateOfCreation, creator, ...restOfOrder } = bodyOrder;
                restOfOrder.lote = lote;
                await this.models.orderModel.update(restOfOrder);
            }
            catch (error) {
                exito = false;
            }
            finally {
                (0, response_controller_1.default)(res, exito ? enums_1.EHttpStatusCode.OK_NO_CONTENT : enums_1.EHttpStatusCode.BAD_REQUEST, exito ? undefined : { exito, message: 'Error al editar la orden' });
            }
        };
        this.removeOrder = async (req, res) => {
            const id = req.params.id;
            let exito = true;
            try {
                await this.models.orderModel.remove(id);
            }
            catch (error) {
                exito = false;
                console.log(error);
            }
            finally {
                (0, response_controller_1.default)(res, exito ? enums_1.EHttpStatusCode.OK_NO_CONTENT : enums_1.EHttpStatusCode.BAD_REQUEST, exito ? undefined : { exito, message: 'Error al eliminar la orden' });
            }
        };
        this.models = models;
    }
}
exports.OrderController = OrderController;
