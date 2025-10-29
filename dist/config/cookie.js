"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigCookie = exports.TokenPerExpiresIn = void 0;
const enums_1 = require("../types/enums");
const env_1 = require("./env");
// EN MS
const CookiePerMaxAge = {
    [enums_1.ECookie.ACCESS_TOKEN]: 1000 * 60 * 60, // valido una hora (ms)
    [enums_1.ECookie.REFRESH_TOKEN]: 1000 * 60 * 60 * 24 * 7 // valido 7 dias (ms)
};
// EN SEGUNDOS
exports.TokenPerExpiresIn = {
    [enums_1.ECookie.ACCESS_TOKEN]: 60 * 60, // valido una hora. (s)
    [enums_1.ECookie.REFRESH_TOKEN]: 60 * 60 * 24 * 7 // valido 7 dias (s)
};
const getConfigCookie = (cookie) => {
    return {
        httpOnly: true, // solo se puede acceder desde el servidor
        secure: env_1.config.nodeEnv === 'production', // solo se puede acceder en HTPPS
        sameSite: true, // solo accesible en el mismo dominio
        maxAge: CookiePerMaxAge[cookie]
    };
};
exports.getConfigCookie = getConfigCookie;
