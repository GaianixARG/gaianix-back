import { ICreateDatosCosecha, ICreateOrderCosecha, IOrderBase, IOrderCosecha } from '../../schemas/order.schema'

export interface IOrderCosechaModel {
  getAll: () => Promise<IOrderCosecha[]>
  getById: (id: string) => Promise<IOrderCosecha | undefined>
  create: (orderBase: IOrderBase, datosCosecha: ICreateDatosCosecha) => Promise<IOrderCosecha>
  update: (id: string, orderCosecha: ICreateOrderCosecha) => Promise<void>
  remove: (id: string) => Promise<void>
}
