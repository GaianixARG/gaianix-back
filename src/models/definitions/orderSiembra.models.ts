import { ICreateDatosSiembra, IDatosSiembra, IOrderBase, IOrderSiembra } from '../../schemas/order.schema'

export interface IOrderSiembraModel {
  getAll: () => Promise<IOrderSiembra[]>
  getById: (id: string) => Promise<IOrderSiembra | undefined>
  create: (orderBase: IOrderBase, datosSiembra: ICreateDatosSiembra) => Promise<IOrderSiembra>
  update: (datosSiembra: IDatosSiembra) => Promise<void>
  remove: (id: string) => Promise<void>
  removeSiembra: (orderSiembra: IOrderSiembra) => Promise<void>
}
