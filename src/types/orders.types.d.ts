import { IUser } from './users.types'
import { ISeed } from './seeds.types'
import { EDistanciaSiembra, EOrderType, EPrioridad, ERiego, EStatus } from './enums'

export interface IOrderBase {
  id: string
  codigo: string
  type: EOrderType
  title: string
  lote: string
  dateOfCreation: string // ISO string
  status: EStatus
  creator: IUser
}

export interface IOrderSiembra extends IOrderBase {
  type: EOrderType.Siembra
  siembra: {
    fechaMaxSiembra: string
    prioridad: EPrioridad
    tipoSemilla: ISeed
    cantidadSemillasHa: number
    cantidadHectareas: number
    fertilizante: string
    distanciaSiembra: EDistanciaSiembra
  }
}

export interface IOrderRiego extends IOrderBase {
  type: EOrderType.Riego
  riego: {
    metodo: ERiego
    cantidadMm: number
    horas: number
  }
}

export interface IOrderFertilizacion extends IOrderBase {
  type: EOrderType.Fertilizacion
  fertilizacion: {
    fertilizante: string
    dosisKgHa: number
    metodo: string
  }
}

export interface IOrderCosecha extends IOrderBase {
  type: EOrderType.Cosecha
  cosecha: {
    fechaCosecha: string
    rendimientoEstimado: number
    maquinaria: string
    humedad: number
  }
}

export type IOrder =
  | IOrderSiembra
  | IOrderRiego
  | IOrderFertilizacion
  | IOrderCosecha
