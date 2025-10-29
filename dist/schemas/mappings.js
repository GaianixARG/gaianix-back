"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablasMap = exports.DatosOrdenMap = exports.DatosOrdenCosechaMap = exports.DatosOrdenFertilizacionMap = exports.DatosOrdenSiembraMap = exports.DatosSemillaMap = exports.LoteMap = exports.CampoMap = exports.SeedMap = exports.FertilizerMap = exports.UserMap = exports.RolMap = void 0;
const enums_1 = require("../types/enums");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.RolMap = {
    id: 'rol_id',
    name: 'rol_nombre'
};
exports.UserMap = {
    id: 'usu_id',
    name: 'usu_name',
    username: 'usu_username',
    password: 'usu_password',
    role: 'usu_role'
};
exports.FertilizerMap = {
    id: 'fer_id',
    name: 'fer_nombre'
};
exports.SeedMap = {
    id: 'sem_id',
    name: 'sem_nombre',
    type: 'sem_tipo'
};
exports.CampoMap = {
    id: 'cam_id',
    nombre: 'cam_nombre'
};
exports.LoteMap = {
    id: 'lot_id',
    codigo: 'lot_codigo',
    campo: 'lot_campo'
};
// #region SIEMBRA
exports.DatosSemillaMap = {
    id: 'sxs_id',
    semilla: 'sxs_semilla',
    cantidadSemillasHa: 'sxs_cantidad_semilla_x_ha'
};
exports.DatosOrdenSiembraMap = {
    id: 'ods_id',
    datosSemilla: 'ods_datos_semilla',
    fechaMaxSiembra: 'ods_fecha_max_siembra',
    distanciaSiembra: 'ods_distancia_siembra_en_m2',
    cantidadHectareas: 'ods_cantidad_hectareas',
    fertilizante: 'ods_fertilizante'
};
// #endregion
// #region FERTILIZACION
exports.DatosOrdenFertilizacionMap = {
    id: 'odf_id',
    fertilizante: 'odf_fertilizante',
    dosisKgHa: 'odf_dosis_kg_ha',
    metodo: 'odf_metodo'
};
// #endregion
// #region  COSECHA
exports.DatosOrdenCosechaMap = {
    id: 'odc_id',
    fechaCosecha: 'odc_fecha_cosecha',
    rendimientoEstimado: 'odc_rendimiento_estimado',
    maquinaria: 'odc_metodo',
    humedad: 'odc_humedad'
};
// #endregion
// #region  ORDEN
exports.DatosOrdenMap = {
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
};
exports.TablasMap = {
    [enums_1.ETablas.User]: {
        dt: 'Usuario',
        alias: 'usu',
        map: exports.UserMap,
        rels: {
            [enums_1.ETablas.Rol]: 'usu_role'
        },
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => {
                switch (k) {
                    case 'password':
                        obj[k] = bcrypt_1.default.hashSync(datos.password, 10);
                        break;
                    default:
                        obj[k] = datos[k];
                        break;
                }
            });
            return obj;
        }
    },
    [enums_1.ETablas.Seed]: {
        dt: 'Semilla',
        alias: 'sem',
        map: exports.SeedMap,
        rels: {},
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => { obj[k] = datos[k]; });
            return obj;
        }
    },
    [enums_1.ETablas.Order]: {
        dt: 'OrdenDeTrabajo',
        alias: 'odt',
        map: exports.DatosOrdenMap,
        rels: {
            [enums_1.ETablas.OrdenSiembra]: 'odt_id_siembra',
            [enums_1.ETablas.OrdenFertilizacion]: 'odt_id_fertilizacion',
            [enums_1.ETablas.OrdenCosecha]: 'odt_id_cosecha',
            [enums_1.ETablas.User]: 'odt_alta_usuario',
            [enums_1.ETablas.Lote]: 'odt_lote'
        },
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => {
                let value;
                switch (k) {
                    case 'creator':
                        value = datos.creator.id;
                        break;
                    case 'siembra':
                        value = datos.type === enums_1.EOrderType.Siembra ? datos.siembra.id : null;
                        break;
                    case 'cosecha':
                        value = datos.type === enums_1.EOrderType.Cosecha ? datos.cosecha.id : null;
                        break;
                    case 'fertilizacion':
                        value = datos.type === enums_1.EOrderType.Fertilizacion ? datos.fertilizacion.id : null;
                        break;
                    case 'lote':
                        value = datos.lote.id;
                        break;
                    default:
                        value = datos[k];
                        break;
                }
                obj[k] = value;
            });
            return obj;
        }
    },
    [enums_1.ETablas.OrdenSiembra]: {
        dt: 'OrdenSiembra',
        alias: 'ods',
        map: exports.DatosOrdenSiembraMap,
        rels: {
            [enums_1.ETablas.SemillaPorSiembra]: 'ods_datos_semilla',
            [enums_1.ETablas.Fertilizante]: 'ods_fertilizante'
        },
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => {
                let value;
                switch (k) {
                    case 'datosSemilla':
                        value = datos.datosSemilla.id;
                        break;
                    case 'fertilizante':
                        value = datos.fertilizante?.id;
                        break;
                    default:
                        value = datos[k];
                        break;
                }
                obj[k] = value;
            });
            return obj;
        }
    },
    [enums_1.ETablas.OrdenCosecha]: {
        dt: 'OrdenCosecha',
        alias: 'odc',
        map: exports.DatosOrdenCosechaMap,
        rels: {},
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => { obj[k] = datos[k]; });
            return obj;
        }
    },
    [enums_1.ETablas.OrdenFertilizacion]: {
        dt: 'OrdenFertilizacion',
        alias: 'odf',
        map: exports.DatosOrdenFertilizacionMap,
        rels: {
            [enums_1.ETablas.Fertilizante]: 'odf_fertilizante'
        },
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => {
                let value;
                switch (k) {
                    case 'fertilizante':
                        value = datos.fertilizante.id;
                        break;
                    default:
                        value = datos[k];
                        break;
                }
                obj[k] = value;
            });
            return obj;
        }
    },
    [enums_1.ETablas.SemillaPorSiembra]: {
        dt: 'SemillaXSiembra',
        alias: 'sxs',
        map: exports.DatosSemillaMap,
        rels: {
            [enums_1.ETablas.Seed]: 'sxs_semilla'
        },
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => {
                let value;
                switch (k) {
                    case 'semilla':
                        value = datos.semilla.id;
                        break;
                    default:
                        value = datos[k];
                        break;
                }
                obj[k] = value;
            });
            return obj;
        }
    },
    [enums_1.ETablas.Rol]: {
        dt: 'Rol',
        alias: 'rol',
        map: exports.RolMap,
        rels: {},
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => { obj[k] = datos[k]; });
            return obj;
        }
    },
    [enums_1.ETablas.Campo]: {
        dt: 'Campo',
        alias: 'cam',
        map: exports.CampoMap,
        rels: {},
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => { obj[k] = datos[k]; });
            return obj;
        }
    },
    [enums_1.ETablas.Lote]: {
        dt: 'Lote',
        alias: 'lot',
        map: exports.LoteMap,
        rels: {
            [enums_1.ETablas.Campo]: 'lot_campo'
        },
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => {
                switch (k) {
                    case 'campo':
                        obj[k] = datos.campo.id;
                        break;
                    default:
                        obj[k] = datos[k];
                        break;
                }
            });
            return obj;
        }
    },
    [enums_1.ETablas.Fertilizante]: {
        dt: 'Fertilizante',
        alias: 'fer',
        map: exports.FertilizerMap,
        rels: {},
        values: (objKeys, datos) => {
            const obj = {};
            objKeys.forEach((k) => { obj[k] = datos[k]; });
            return obj;
        }
    }
};
// #endregion
