import { IDatosSemilla, IDatosSiembra, IOrderCosecha, IOrderSiembra, IOrderFertilizacion, IDatosFertilizacion, IDatosCosecha, IOrder, IOrderBase } from '../schemas/order.schema'
import { ISeed } from '../schemas/seed.schema'
import { IRol, IUser } from '../schemas/user.schema'
import { EOrderType, ETablas } from '../types/enums'

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

// #region SEED
export type KeysSeed = Keys<ISeed>
export const SeedMap: Record<KeysSeed, string> = {
  id: 'sem_id',
  name: 'sem_nombre',
  type: 'sem_tipo'
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
  distanciaSiembra: 'ods_distancia_siembra_en_m2'
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
export type AllKeys = KeysUser | KeysSeed | KeysOrden | KeysDatosSemilla | KeysDatosSiembra | KeysDatosCosecha | KeysDatosFertilizacion

interface UsosTabla<T, K extends keyof T> {
  dt: string
  alias: string
  map: PartialRecord<AllKeys, string>
  rels: PartialRecord<ETablas, string>
  values: (objKeys: K[], datos: T) => any[]
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
      return objKeys.map((k) => {
        switch (k) {
          case 'id': return 'gen_random_uuid()'
          default: return datos[k]
        }
      })
    }
  },
  [ETablas.Seed]: {
    dt: 'Semilla',
    alias: 'sem',
    map: SeedMap,
    rels: {},
    values: (objKeys: KeysSeed[], datos: ISeed) => {
      return objKeys.map((k) => {
        switch (k) {
          case 'id': return 'gen_random_uuid()'
          default: return datos[k]
        }
      })
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
      [ETablas.User]: 'odt_alta_usuario'
    },
    values: (objKeys: KeysOrden[], datos: IOrder) => {
      return objKeys.map((k) => {
        switch (k) {
          case 'id': return 'gen_random_uuid()'
          case 'creator': return datos.creator.id
          case 'codigo': return datos.codigo
          case 'dateOfCreation': return 'CURRENT_DATE'
          case 'siembra': return datos.type === EOrderType.Siembra ? datos.siembra.id : null
          case 'cosecha': return datos.type === EOrderType.Cosecha ? datos.cosecha.id : null
          case 'fertilizacion': return datos.type === EOrderType.Fertilizacion ? datos.fertilizacion.id : null
          default: return datos[k]
        }
      })
    }
  },
  [ETablas.OrdenSiembra]: {
    dt: 'OrdenSiembra',
    alias: 'ods',
    map: DatosOrdenSiembraMap,
    rels: {
      [ETablas.DatosSemillaXSiembra]: 'ods_datos_semilla'
    },
    values: (objKeys: KeysDatosSiembra[], datos: IDatosSiembra) => {
      return objKeys.map((k) => {
        switch (k) {
          case 'id': return 'gen_random_uuid()'
          case 'datosSemilla': return datos.datosSemilla.id
          default: return datos[k]
        }
      })
    }
  },
  [ETablas.OrdenCosecha]: {
    dt: 'OrdenCosecha',
    alias: 'odc',
    map: DatosOrdenCosechaMap,
    rels: {},
    values: (objKeys: KeysDatosCosecha[], datos: IDatosCosecha) => {
      return objKeys.map((k) => {
        switch (k) {
          case 'id': return 'gen_random_uuid()'
          default: return datos[k]
        }
      })
    }
  },
  [ETablas.OrdenFertilizacion]: {
    dt: 'OrdenFertilizacion',
    alias: 'odf',
    map: DatosOrdenFertilizacionMap,
    rels: {},
    values: (objKeys: KeysDatosFertilizacion[], datos: IDatosFertilizacion) => {
      return objKeys.map((k) => {
        switch (k) {
          case 'id': return 'gen_random_uuid()'
          default: return datos[k]
        }
      })
    }
  },
  [ETablas.DatosSemillaXSiembra]: {
    dt: 'SemillaXSiembra',
    alias: 'sxs',
    map: DatosSemillaMap,
    rels: {
      [ETablas.Seed]: 'sxs_semilla'
    },
    values: (objKeys: KeysDatosSemilla[], datos: IDatosSemilla) => {
      return objKeys.map((k) => {
        switch (k) {
          case 'id': return 'gen_random_uuid()'
          case 'semilla': return datos.semilla.id
          default: return datos[k]
        }
      })
    }
  },
  [ETablas.Rol]: {
    dt: 'Rol',
    alias: 'rol',
    map: RolMap,
    rels: {},
    values: (objKeys: KeysRol[], datos: IRol) => {
      return objKeys.map((k) => {
        switch (k) {
          case 'id': return 'gen_random_uuid()'
          default: return datos[k]
        }
      })
    }
  }
}
// #endregion
