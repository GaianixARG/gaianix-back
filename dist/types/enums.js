"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETablas = exports.ECookie = exports.EHttpStatusCode = exports.ESeed = exports.EDistanciaSiembra = exports.EPrioridad = exports.ERiego = exports.EOrderType = exports.EStatus = void 0;
var EStatus;
(function (EStatus) {
    EStatus[EStatus["Pendiente"] = 0] = "Pendiente";
    EStatus[EStatus["EnCurso"] = 1] = "EnCurso";
    EStatus[EStatus["Completada"] = 2] = "Completada";
})(EStatus || (exports.EStatus = EStatus = {}));
var EOrderType;
(function (EOrderType) {
    EOrderType["Siembra"] = "S";
    EOrderType["Fertilizacion"] = "F";
    EOrderType["Cosecha"] = "C";
})(EOrderType || (exports.EOrderType = EOrderType = {}));
var ERiego;
(function (ERiego) {
    ERiego["Goteo"] = "Goteo";
    ERiego["Aspersion"] = "Aspersi\u00F3n";
    ERiego["Inundacion"] = "Inundaci\u00F3n";
})(ERiego || (exports.ERiego = ERiego = {}));
var EPrioridad;
(function (EPrioridad) {
    EPrioridad[EPrioridad["Alta"] = 0] = "Alta";
    EPrioridad[EPrioridad["Media"] = 1] = "Media";
    EPrioridad[EPrioridad["Baja"] = 2] = "Baja";
})(EPrioridad || (exports.EPrioridad = EPrioridad = {}));
var EDistanciaSiembra;
(function (EDistanciaSiembra) {
    EDistanciaSiembra[EDistanciaSiembra["Cercana"] = 62] = "Cercana";
    EDistanciaSiembra[EDistanciaSiembra["Media"] = 70] = "Media";
    EDistanciaSiembra[EDistanciaSiembra["Lejana"] = 90] = "Lejana";
})(EDistanciaSiembra || (exports.EDistanciaSiembra = EDistanciaSiembra = {}));
var ESeed;
(function (ESeed) {
    ESeed["Maiz"] = "Ma\u00EDz";
    ESeed["Trigo"] = "Trigo";
    ESeed["Soja"] = "Soja";
    ESeed["Girasol"] = "Girasol";
    ESeed["Arroz"] = "Arroz";
    ESeed["Cebada"] = "Cebada";
    ESeed["Avena"] = "Avena";
})(ESeed || (exports.ESeed = ESeed = {}));
var EHttpStatusCode;
(function (EHttpStatusCode) {
    // errors server
    EHttpStatusCode[EHttpStatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    // error client
    EHttpStatusCode[EHttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    EHttpStatusCode[EHttpStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    EHttpStatusCode[EHttpStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    EHttpStatusCode[EHttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    // correct
    EHttpStatusCode[EHttpStatusCode["OK"] = 200] = "OK";
    EHttpStatusCode[EHttpStatusCode["OK_CREATED"] = 201] = "OK_CREATED";
    EHttpStatusCode[EHttpStatusCode["OK_NO_CONTENT"] = 204] = "OK_NO_CONTENT";
})(EHttpStatusCode || (exports.EHttpStatusCode = EHttpStatusCode = {}));
var ECookie;
(function (ECookie) {
    ECookie["ACCESS_TOKEN"] = "gaianix_access_token";
    ECookie["REFRESH_TOKEN"] = "gaianix_refresh_token";
})(ECookie || (exports.ECookie = ECookie = {}));
var ETablas;
(function (ETablas) {
    ETablas["User"] = "Usuario";
    // UserSupabase = 'auth.users',
    ETablas["Rol"] = "Rol";
    ETablas["Seed"] = "Semilla";
    ETablas["Order"] = "OrdenDeTrabajo";
    ETablas["OrdenSiembra"] = "OrdenSiembra";
    ETablas["OrdenCosecha"] = "OrdenCosecha";
    ETablas["OrdenFertilizacion"] = "OrdenFertilizacion";
    ETablas["SemillaPorSiembra"] = "SemillaXSiembra";
    ETablas["Campo"] = "Campo";
    ETablas["Lote"] = "Lote";
    ETablas["Fertilizante"] = "Fertilizante";
})(ETablas || (exports.ETablas = ETablas = {}));
