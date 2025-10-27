import { ICreateDatosCosecha, IDatosCosecha, IOrderBase, IOrderCosecha } from '../../schemas/order.schema'

export interface IOrderCosechaModel {
  getAll: () => Promise<IOrderCosecha[]>
  getById: (id: string) => Promise<IOrderCosecha | undefined>
  create: (orderBase: IOrderBase, datosCosecha: ICreateDatosCosecha) => Promise<IOrderCosecha>
  update: (datosCosecha: IDatosCosecha) => Promise<void>
  remove: (id: string) => Promise<void>
  removeCosecha: (orderCosecha: IOrderCosecha) => Promise<void>
}
