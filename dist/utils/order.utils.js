"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySelectOrdenByTypeSupabase = exports.querySelectOdtBaseSupbase = exports.queryGetNewCode = exports.querySelectOrdenByType = exports.querySelectOdtBase = void 0;
const bd_services_1 = require("../services/bd.services");
const enums_1 = require("../types/enums");
const querySelectOdtBase = () => `SELECT *
  FROM "${enums_1.ETablas.Order}"
  ${bd_services_1.BDService.queryJoin('INNER', enums_1.ETablas.Order, enums_1.ETablas.User)}
  ${bd_services_1.BDService.queryJoin('INNER', enums_1.ETablas.User, enums_1.ETablas.Rol)}
  ${bd_services_1.BDService.queryJoin('INNER', enums_1.ETablas.Order, enums_1.ETablas.Lote)}
  ${bd_services_1.BDService.queryJoin('INNER', enums_1.ETablas.Lote, enums_1.ETablas.Campo)}`;
exports.querySelectOdtBase = querySelectOdtBase;
const querySelectOrdenByType = (type) => {
    let queryBase = (0, exports.querySelectOdtBase)();
    if (type == null || type === enums_1.EOrderType.Siembra) {
        queryBase += `${bd_services_1.BDService.queryJoin('LEFT', enums_1.ETablas.Order, enums_1.ETablas.OrdenSiembra)}
    ${bd_services_1.BDService.queryJoin('LEFT', enums_1.ETablas.OrdenSiembra, enums_1.ETablas.SemillaPorSiembra)}
    ${bd_services_1.BDService.queryJoin('LEFT', enums_1.ETablas.OrdenSiembra, enums_1.ETablas.Fertilizante)}
    ${bd_services_1.BDService.queryJoin('LEFT', enums_1.ETablas.SemillaPorSiembra, enums_1.ETablas.Seed)}`;
    }
    if (type == null || type === enums_1.EOrderType.Fertilizacion) {
        queryBase += `${bd_services_1.BDService.queryJoin('LEFT', enums_1.ETablas.Order, enums_1.ETablas.OrdenFertilizacion)}
    ${bd_services_1.BDService.queryJoin('LEFT', enums_1.ETablas.OrdenFertilizacion, enums_1.ETablas.Fertilizante)}`;
    }
    if (type == null || type === enums_1.EOrderType.Cosecha) {
        queryBase += bd_services_1.BDService.queryJoin('LEFT', enums_1.ETablas.Order, enums_1.ETablas.OrdenCosecha);
    }
    return queryBase;
};
exports.querySelectOrdenByType = querySelectOrdenByType;
const queryGetNewCode = (type) => `WITH ultimo AS (
  SELECT
    MAX(CAST(SUBSTRING(odt_codigo, 2) AS INTEGER)) AS max_num
    FROM "OrdenDeTrabajo"
    WHERE odt_tipo = '${type}'
  )
  SELECT
    CONCAT(
      '${type}',
      LPAD((COALESCE(ultimo.max_num, 0) + 1)::text, 5, '0')
    ) AS codigo
  FROM ultimo;`;
exports.queryGetNewCode = queryGetNewCode;
// #region SUPABASE
const querySelectOdtBaseSupbase = () => {
    return `
    *,
    ${enums_1.ETablas.User}!inner (
      *,
      ${enums_1.ETablas.Rol}!inner (*)
    ),
    ${enums_1.ETablas.Lote}!inner (
      *,
      ${enums_1.ETablas.Campo}!inner (*)
    )
  `;
};
exports.querySelectOdtBaseSupbase = querySelectOdtBaseSupbase;
const querySelectOrdenByTypeSupabase = (type) => {
    let baseQuery = (0, exports.querySelectOdtBaseSupbase)();
    if (type == null || type === enums_1.EOrderType.Siembra) {
        baseQuery += `,
      ${enums_1.ETablas.OrdenSiembra}!left (
        *,
        ${enums_1.ETablas.SemillaPorSiembra}!left (
          *,
          ${enums_1.ETablas.Seed}!left (*)
        ),
        ${enums_1.ETablas.Fertilizante}!left (*)
      )
    `;
    }
    if (type == null || type === enums_1.EOrderType.Fertilizacion) {
        baseQuery += `,
      ${enums_1.ETablas.OrdenFertilizacion}!left (
        *,
        ${enums_1.ETablas.Fertilizante}!left (*)
      )
    `;
    }
    if (type == null || type === enums_1.EOrderType.Cosecha) {
        baseQuery += `, ${enums_1.ETablas.OrdenCosecha}!left (*)
    `;
    }
    return baseQuery;
};
exports.querySelectOrdenByTypeSupabase = querySelectOrdenByTypeSupabase;
// #endregion
