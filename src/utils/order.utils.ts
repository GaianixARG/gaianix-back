import { BDService } from '../services/bd.services'
import { EOrderType, ETablas } from '../types/enums'

export const querySelectOdtBase = (): string => `SELECT *
  FROM "${ETablas.Order}"
  ${BDService.queryJoin('INNER', ETablas.Order, ETablas.User)}
  ${BDService.queryJoin('INNER', ETablas.User, ETablas.Rol)}
  ${BDService.queryJoin('INNER', ETablas.Order, ETablas.Lote)}
  ${BDService.queryJoin('INNER', ETablas.Lote, ETablas.Campo)}`

export const querySelectOrdenByType = (type?: EOrderType): string => {
  let queryBase = querySelectOdtBase()
  if (type == null || type === EOrderType.Siembra) {
    queryBase += `${BDService.queryJoin('LEFT', ETablas.Order, ETablas.OrdenSiembra)}
    ${BDService.queryJoin('LEFT', ETablas.OrdenSiembra, ETablas.SemillaPorSiembra)}
    ${BDService.queryJoin('LEFT', ETablas.OrdenSiembra, ETablas.Fertilizante)}
    ${BDService.queryJoin('LEFT', ETablas.SemillaPorSiembra, ETablas.Seed)}`
  }
  if (type == null || type === EOrderType.Fertilizacion) {
    queryBase += `${BDService.queryJoin('LEFT', ETablas.Order, ETablas.OrdenFertilizacion)}
    ${BDService.queryJoin('LEFT', ETablas.OrdenFertilizacion, ETablas.Fertilizante)}`
  }
  if (type == null || type === EOrderType.Cosecha) {
    queryBase += BDService.queryJoin('LEFT', ETablas.Order, ETablas.OrdenCosecha)
  }

  return queryBase
}

export const queryGetNewCode = (type: EOrderType): string => `WITH ultimo AS (
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
  FROM ultimo;`
