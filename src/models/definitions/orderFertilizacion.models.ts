import { ICreateDatosFertilizacion, IDatosFertilizacion, IOrderBase, IOrderFertilizacion } from '../../schemas/order.schema'

export interface IOrderFertilizacionModel {
  getAll: () => Promise<IOrderFertilizacion[]>
  getById: (id: string) => Promise<IOrderFertilizacion | undefined>
  create: (orderBase: IOrderBase, datosFertilizacion: ICreateDatosFertilizacion) => Promise<IOrderFertilizacion>
  update: (datosFertilizacion: IDatosFertilizacion) => Promise<void>
  remove: (id: string) => Promise<void>
  removeFertilizacion: (orderFert: IOrderFertilizacion) => Promise<void>
}
