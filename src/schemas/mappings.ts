import { IDatosSemilla, IDatosSiembra, IOrderCosecha, IOrderSiembra, IOrderFertilizacion, IDatosFertilizacion, IDatosCosecha, IOrder, IOrderBase } from '../schemas/order.schema'
import { ICreateSeed, ISeed } from '../schemas/seed.schema'
import { IRol, IUser } from '../schemas/user.schema'
import { EOrderType, ETablas } from '../types/enums'
import { ICampo } from './campo.schema'
import { ICreateFertilizer, IFertilizer } from './fertilizer.schema'
import { ILote } from './lote.schema'
import bcrypt from 'bcrypt'

// #region UTILS
export type Keys<T> = keyof T
type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>
// #endregion

// #region USER
export type KeysRol = Keys<IRol>
export const RolMap: Record<KeysRol, string> = {
  id: 'rol_id',
  name: 'rol_nombre'
}

export type KeysUser = Keys<IUser>
export const UserMap: Record<KeysUser, string> = {
  id: 'usu_id',
  name: 'usu_name',
  username: 'usu_username',
  password: 'usu_password',
  role: 'usu_role'
}
// #endregion

// #region Fertilizer
export type KeysFertilizer = Keys<IFertilizer>
export type KeysCreateFertilizer = Keys<ICreateFertilizer>
export const FertilizerMap: Record<KeysFertilizer, string> = {
  id: 'fer_id',
  name: 'fer_nombre'
}
// #endregion

// #region SEED
export type KeysSeed = Keys<ISeed>
export type KeysCreateSeed = Keys<ICreateSeed>
export const SeedMap: Record<KeysSeed, string> = {
  id: 'sem_id',
  name: 'sem_nombre',
  type: 'sem_tipo'
}
// #endregion

// #region Campo
export type KeysCampo = Keys<ICampo>
export type KeysLote = Keys<ILote>

export const CampoMap: Record<KeysCampo, string> = {
  id: 'cam_id',
  nombre: 'cam_nombre'
}

export const LoteMap: Record<KeysLote, string> = {
  id: 'lot_id',
  codigo: 'lot_codigo',
  campo: 'lot_campo'

}
// #endregion

// #region ORDERS
export type KeysOrdenBase = Keys<IOrderBase>
export type KeysOrden = Keys<IOrderSiembra> | Keys<IOrderCosecha> | Keys<IOrderFertilizacion>
export type KeysDatosSemilla = Keys<IDatosSemilla>
export type KeysDatosSiembra = Keys<IDatosSiembra>
export type KeysDatosFertilizacion = Keys<IDatosFertilizacion>
export type KeysDatosCosecha = Keys<IDatosCosecha>

// #region SIEMBRA
export const DatosSemillaMap: Record<KeysDatosSemilla, string> = {
  id: 'sxs_id',
  semilla: 'sxs_semilla',
  cantidadSemillasHa: 'sxs_cantidad_semilla_x_ha'
}

export const DatosOrdenSiembraMap: Record<KeysDatosSiembra, string> = {
  id: 'ods_id',
  datosSemilla: 'ods_datos_semilla',
  fechaMaxSiembra: 'ods_fecha_max_siembra',
  distanciaSiembra: 'ods_distancia_siembra_en_m2',
  cantidadHectareas: 'ods_cantidad_hectareas',
  fertilizante: 'ods_fertilizante'
}
// #endregion

// #region FERTILIZACION
export const DatosOrdenFertilizacionMap: Record<KeysDatosFertilizacion, string> = {
  id: 'odf_id',
  fertilizante: 'odf_fertilizante',
  dosisKgHa: 'odf_dosis_kg_ha',
  metodo: 'odf_metodo'
}
// #endregion

// #region  COSECHA
export const DatosOrdenCosechaMap: Record<KeysDatosCosecha, string> = {
  id: 'odc_id',
  fechaCosecha: 'odc_fecha_cosecha',
  rendimientoEstimado: 'odc_rendimiento_estimado',
  maquinaria: 'odc_metodo',
  humedad: 'odc_humedad'
}
// #endregion

// #region  ORDEN
export const DatosOrdenMap: Record<KeysOrden, string> = {
  id: 'odt_id',
  siembra: 'odt_id_siembra',
  fertilizacion: 'odt_id_fertilizacion',
  cosecha: 'odt_id_cosecha',
  lote: 'odt_lote',
  title: 'odt_titulo',
  codigo: 'odt_codigo',
  status: 'odt_estado',
  type: 'odt_tipo',
  creator: 'odt_alta_usuario',
  dateOfCreation: 'odt_alta_fecha',
  prioridad: 'odt_prioridad'
}
// #endregion
// #endregion

// #region TABLAS
export type AllObjects = IUser | ISeed | IOrder | IDatosSemilla | IDatosSiembra | IDatosCosecha | IDatosFertilizacion | IFertilizer | ICampo | ILote
export type AllKeys = KeysUser | KeysSeed | KeysOrden | KeysDatosSemilla | KeysDatosSiembra | KeysDatosCosecha | KeysDatosFertilizacion

interface UsosTabla<T, K extends keyof T> {
  dt: string
  alias: string
  map: PartialRecord<AllKeys, string>
  rels: PartialRecord<ETablas, string>
  values: (objKeys: K[], datos: T) => PartialRecord<K, any>
}

export const TablasMap: Record<ETablas, UsosTabla<any, any>> = {
  [ETablas.User]: {
    dt: 'Usuario',
    alias: 'usu',
    map: UserMap,
    rels: {
      [ETablas.Rol]: 'usu_role'
    },
    values: (objKeys: KeysUser[], datos: IUser) => {
      const obj: Partial<Record<KeysUser, any>> = {}
      objKeys.forEach((k) => {
        switch (k) {
          case 'password': obj[k] = bcrypt.hashSync(datos.password, 10); break
          default: obj[k] = datos[k]; break
        }
      })
      return obj
    }
  },
  [ETablas.Seed]: {
    dt: 'Semilla',
    alias: 'sem',
    map: SeedMap,
    rels: {},
    values: (objKeys: KeysSeed[], datos: ISeed) => {
      const obj: Partial<Record<KeysSeed, any>> = {}
      objKeys.forEach((k) => { obj[k] = datos[k] })
      return obj
    }
  },
  [ETablas.Order]: {
    dt: 'OrdenDeTrabajo',
    alias: 'odt',
    map: DatosOrdenMap,
    rels: {
      [ETablas.OrdenSiembra]: 'odt_id_siembra',
      [ETablas.OrdenFertilizacion]: 'odt_id_fertilizacion',
      [ETablas.OrdenCosecha]: 'odt_id_cosecha',
      [ETablas.User]: 'odt_alta_usuario',
      [ETablas.Lote]: 'odt_lote'
    },
    values: (objKeys: KeysOrden[], datos: IOrder) => {
      const obj: Partial<Record<KeysOrden, any>> = {}
      objKeys.forEach((k) => {
        let value: any
        switch (k) {
          case 'creator': value = datos.creator.id; break
          case 'siembra': value = datos.type === EOrderType.Siembra ? datos.siembra.id : null; break
          case 'cosecha': value = datos.type === EOrderType.Cosecha ? datos.cosecha.id : null; break
          case 'fertilizacion': value = datos.type === EOrderType.Fertilizacion ? datos.fertilizacion.id : null; break
          case 'lote': value = datos.lote.id; break
          default: value = datos[k]; break
        }
        obj[k] = value
      })
      return obj
    }
  },
  [ETablas.OrdenSiembra]: {
    dt: 'OrdenSiembra',
    alias: 'ods',
    map: DatosOrdenSiembraMap,
    rels: {
      [ETablas.SemillaPorSiembra]: 'ods_datos_semilla',
      [ETablas.Fertilizante]: 'ods_fertilizante'
    },
    values: (objKeys: KeysDatosSiembra[], datos: IDatosSiembra) => {
      const obj: Partial<Record<KeysDatosSiembra, any>> = {}
      objKeys.forEach((k) => {
        let value: any
        switch (k) {
          case 'datosSemilla': value = datos.datosSemilla.id; break
          case 'fertilizante': value = datos.fertilizante?.id; break
          default: value = datos[k]; break
        }
        obj[k] = value
      })
      return obj
    }
  },
  [ETablas.OrdenCosecha]: {
    dt: 'OrdenCosecha',
    alias: 'odc',
    map: DatosOrdenCosechaMap,
    rels: {},
    values: (objKeys: KeysDatosCosecha[], datos: IDatosCosecha) => {
      const obj: Partial<Record<KeysDatosCosecha, any>> = {}
      objKeys.forEach((k) => { obj[k] = datos[k] })
      return obj
    }
  },
  [ETablas.OrdenFertilizacion]: {
    dt: 'OrdenFertilizacion',
    alias: 'odf',
    map: DatosOrdenFertilizacionMap,
    rels: {
      [ETablas.Fertilizante]: 'odf_fertilizante'
    },
    values: (objKeys: KeysDatosFertilizacion[], datos: IDatosFertilizacion) => {
      const obj: Partial<Record<KeysDatosFertilizacion, any>> = {}
      objKeys.forEach((k) => {
        let value: any
        switch (k) {
          case 'fertilizante': value = datos.fertilizante.id; break
          default: value = datos[k]; break
        }
        obj[k] = value
      })
      return obj
    }
  },
  [ETablas.SemillaPorSiembra]: {
    dt: 'SemillaXSiembra',
    alias: 'sxs',
    map: DatosSemillaMap,
    rels: {
      [ETablas.Seed]: 'sxs_semilla'
    },
    values: (objKeys: KeysDatosSemilla[], datos: IDatosSemilla) => {
      const obj: Partial<Record<KeysDatosSemilla, any>> = {}
      objKeys.forEach((k) => {
        let value: any
        switch (k) {
          case 'semilla': value = datos.semilla.id; break
          default: value = datos[k]; break
        }
        obj[k] = value
      })
      return obj
    }
  },
  [ETablas.Rol]: {
    dt: 'Rol',
    alias: 'rol',
    map: RolMap,
    rels: {},
    values: (objKeys: KeysRol[], datos: IRol) => {
      const obj: Partial<Record<KeysRol, any>> = {}
      objKeys.forEach((k) => { obj[k] = datos[k] })
      return obj
    }
  },
  [ETablas.Campo]: {
    dt: 'Campo',
    alias: 'cam',
    map: CampoMap,
    rels: {},
    values: (objKeys: KeysCampo[], datos: ICampo) => {
      const obj: Partial<Record<KeysCampo, any>> = {}
      objKeys.forEach((k) => { obj[k] = datos[k] })
      return obj
    }
  },
  [ETablas.Lote]: {
    dt: 'Lote',
    alias: 'lot',
    map: LoteMap,
    rels: {
      [ETablas.Campo]: 'lot_campo'
    },
    values: (objKeys: KeysLote[], datos: ILote) => {
      const obj: Partial<Record<KeysLote, any>> = {}
      objKeys.forEach((k) => {
        switch (k) {
          case 'campo': obj[k] = datos.campo.id; break
          default: obj[k] = datos[k]; break
        }
      })
      return obj
    }
  },
  [ETablas.Fertilizante]: {
    dt: 'Fertilizante',
    alias: 'fer',
    map: FertilizerMap,
    rels: {},
    values: (objKeys: KeysFertilizer[], datos: IFertilizer) => {
      const obj: Partial<Record<KeysFertilizer, any>> = {}
      objKeys.forEach((k) => { obj[k] = datos[k] })
      return obj
    }
  }
}
// #endregion
