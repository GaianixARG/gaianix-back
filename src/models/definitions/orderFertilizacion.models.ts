import { ICreateDatosFertilizacion, ICreateOrderFertilizacion, IOrderBase, IOrderFertilizacion } from '../../schemas/order.schema'

export interface IOrderFertilizacionModel {
  getAll: () => Promise<IOrderFertilizacion[]>
  getById: (id: string) => Promise<IOrderFertilizacion | undefined>
  create: (orderBase: IOrderBase, datosFertilizacion: ICreateDatosFertilizacion) => Promise<IOrderFertilizacion>
  update: (id: string, orderFertilizacion: ICreateOrderFertilizacion) => Promise<void>
  remove: (id: string) => Promise<void>
}
