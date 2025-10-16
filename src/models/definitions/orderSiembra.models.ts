import { ICreateDatosSiembra, ICreateOrderSiembra, IOrderBase, IOrderSiembra } from '../../schemas/order.schema'

export interface IOrderSiembraModel {
  getAll: () => Promise<IOrderSiembra[]>
  getById: (id: string) => Promise<IOrderSiembra | undefined>
  create: (orderBase: IOrderBase, datosSiembra: ICreateDatosSiembra) => Promise<IOrderSiembra>
  update: (id: string, orderSiembra: ICreateOrderSiembra) => Promise<void>
  remove: (id: string) => Promise<void>
}
