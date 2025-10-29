"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModelFileSystem = void 0;
const orders_json_1 = __importDefault(require("../../data/orders.json"));
const enums_1 = require("../../types/enums");
const orders = orders_json_1.default;
class OrderModelFileSystem {
    constructor() {
        this.update = async (order) => {
            const idx = orders.findIndex(x => x.id === order.id);
            if (idx === -1)
                return;
            const antOrd = orders[idx];
            orders[idx] = {
                ...antOrd,
                ...order
            };
        };
        this.remove = async (id) => {
            orders.filter(x => x.id !== id);
        };
        this.getAll = async () => orders;
        this.getById = async (id) => orders.find(x => x.id === id);
        this.getByType = async (type) => orders.filter(x => x.type === type);
        this.create = async (order, creator) => {
            const typeOrder = order.type.charAt(0);
            const maxCode = Math.max(...orders.map(x => +x.codigo.slice(1)));
            const newOrderBase = {
                id: 'asdasd',
                codigo: `${typeOrder}${maxCode.toString().padStart(4, '0')}`,
                creator,
                dateOfCreation: 'string',
                title: order.title,
                type: enums_1.EOrderType.Siembra,
                status: order.status,
                lote: {
                    id: order.lote.id,
                    codigo: '',
                    campo: {
                        id: '1',
                        nombre: ''
                    }
                },
                prioridad: order.prioridad
            };
            let newOrder;
            if (newOrderBase.type === enums_1.EOrderType.Siembra && order.type === enums_1.EOrderType.Siembra) {
                const datosSemilla = {
                    ...order.siembra.datosSemilla,
                    id: '10'
                };
                newOrder = {
                    ...newOrderBase,
                    id: '10',
                    type: newOrderBase.type,
                    siembra: {
                        id: '10',
                        fechaMaxSiembra: order.siembra.fechaMaxSiembra,
                        distanciaSiembra: order.siembra.distanciaSiembra,
                        datosSemilla,
                        cantidadHectareas: 0,
                        fertilizante: null
                    }
                };
            }
            if (newOrderBase.type === enums_1.EOrderType.Cosecha && order.type === enums_1.EOrderType.Cosecha) {
                newOrder = {
                    ...newOrderBase,
                    type: newOrderBase.type,
                    cosecha: {
                        ...order.cosecha,
                        id: '11'
                    }
                };
            }
            if (newOrderBase.type === enums_1.EOrderType.Fertilizacion && order.type === enums_1.EOrderType.Fertilizacion) {
                newOrder = {
                    ...newOrderBase,
                    type: newOrderBase.type,
                    fertilizacion: {
                        ...order.fertilizacion,
                        id: '11'
                    }
                };
            }
            if (newOrder == null)
                throw new Error('Error al crear la orden de trabajo');
            orders.push(newOrder);
            return newOrder;
        };
    }
}
exports.OrderModelFileSystem = OrderModelFileSystem;
